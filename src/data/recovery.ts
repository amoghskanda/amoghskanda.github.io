export type Scenario = 'lost-ack' | 'stale-view' | 'tool-timeout';
export type Phase = 'observe' | 'act' | 'verify' | 'recover';
export type EventKind = 'neutral' | 'fault' | 'check' | 'success';
export interface RecoveryState {
  effects: number;
  retries: number;
  revision: number;
  observedRevision: number;
  completed: boolean;
  operationRecorded: boolean;
}
export interface TraceEvent { phase: Phase; title: string; detail: string; kind: EventKind; state: RecoveryState }
export interface RecoveryTrace {
  kind: 'synthetic-fixture-replay';
  scenario: Scenario;
  policy: 'checked-recovery' | 'naive-policy';
  events: TraceEvent[];
  checks: { label: string; passed: boolean }[];
  finalState: RecoveryState;
}

export const recoveryFixtures = {
  'lost-ack': {
    title: 'Lost acknowledgement',
    description: 'A create request succeeds, but its response is lost. Should the agent retry?',
  },
  'stale-view': {
    title: 'Stale observation',
    description: 'The observation is one revision behind the environment. Is the action still valid?',
  },
  'tool-timeout': {
    title: 'Tool timeout',
    description: 'The first request times out before creating a record. Can the workflow finish?',
  },
};

export function makeTrace(scenario: Scenario = 'lost-ack', guarded = true): RecoveryTrace {
  if (!recoveryFixtures[scenario]) throw new Error('Unknown fixture');
  const state: RecoveryState = { effects: 0, retries: 0, revision: 2, observedRevision: scenario === 'stale-view' ? 1 : 2, completed: false, operationRecorded: false };
  const events: TraceEvent[] = [];
  const record = (phase: Phase, title: string, detail: string, kind: EventKind = 'neutral') => {
    events.push({ phase, title, detail, kind, state: { ...state } });
  };
  record('observe', 'Read the environment', `Observation revision ${state.observedRevision}. Environment revision ${state.revision}.`);

  if (scenario === 'lost-ack') {
    state.effects += 1;
    state.operationRecorded = true;
    record('act', 'Create record · operation 17', 'The environment commits the write. Its acknowledgement is dropped.', 'fault');
    if (guarded) {
      record('verify', 'Inspect operation 17', 'The operation ledger confirms that the write already happened.', 'check');
      state.completed = true;
      record('recover', 'Reuse the committed result', 'The workflow completes with exactly one recorded effect.', 'success');
    } else {
      state.retries += 1;
      state.effects += 1;
      record('recover', 'Retry without checking state', 'A second create request produces a duplicate record.', 'fault');
      state.completed = true;
      record('verify', 'The request returned successfully', 'The agent finishes, but the environment contains two effects.', 'fault');
    }
  }

  if (scenario === 'stale-view') {
    if (guarded) {
      record('verify', 'Check the revision', 'The observation does not match the current environment.', 'check');
      state.observedRevision = state.revision;
      record('observe', 'Refresh the observation', 'The action is rebuilt from revision 2.', 'check');
      state.effects += 1;
      state.operationRecorded = true;
      state.completed = true;
      record('act', 'Apply to the current revision', 'The environment accepts the action and records one effect.', 'success');
    } else {
      record('act', 'Act on revision 1', 'The intended target changed. The environment rejects the action.', 'fault');
      record('verify', 'Workflow is incomplete', 'The agent has no refresh or recovery step.', 'fault');
    }
  }

  if (scenario === 'tool-timeout') {
    record('act', 'The tool times out', 'No write was committed. The first attempt has no effect.', 'fault');
    if (guarded) {
      record('verify', 'Inspect the operation ledger', 'Operation 17 is absent. A bounded retry is permitted.', 'check');
      state.retries += 1;
      state.effects += 1;
      state.operationRecorded = true;
      state.completed = true;
      record('recover', 'Retry the uncommitted operation', 'The second attempt commits one record and completes the workflow.', 'success');
    } else {
      record('verify', 'Stop after the timeout', 'The workflow ends without creating the required record.', 'fault');
    }
  }

  const checks = [
    { label: 'Controller finished', passed: state.completed },
    { label: 'Exactly one effect', passed: state.effects === 1 },
    { label: 'Current observation', passed: state.observedRevision === state.revision },
  ];
  return { kind: 'synthetic-fixture-replay', scenario, policy: guarded ? 'checked-recovery' : 'naive-policy', events, checks, finalState: { ...state } };
}
