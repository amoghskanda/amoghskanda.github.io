import { makeTrace, recoveryFixtures } from '../data/recovery';

export function initRecoveryLab(root) {
  const select = root.querySelector('select');
  const play = root.querySelector('.recovery-play');
  const step = root.querySelector('.recovery-step');
  const result = root.querySelector('.recovery-result');
  const eventList = root.querySelector('.recovery-events');
  let trace;
  let visible = 1;
  let timer;

  function stop() {
    clearTimeout(timer);
    timer = undefined;
    play.innerHTML = 'Replay fixture <span aria-hidden="true">↗</span>';
  }

  function render() {
    const events = trace.events.slice(0, visible);
    const last = events.at(-1);
    root.querySelector('.recovery-counter').textContent = `${visible} / ${trace.events.length} events`;
    root.querySelector('.recovery-announcement').textContent = `Step ${visible} of ${trace.events.length}. ${last.phase}: ${last.title}. ${last.detail}`;
    root.querySelectorAll('[data-phase]').forEach((el) => {
      const active = el.dataset.phase === last.phase;
      el.classList.toggle('is-active', active);
      if (active) el.setAttribute('aria-current', 'step');
      else el.removeAttribute('aria-current');
    });
    eventList.innerHTML = events.map((event, index) => `
      <div class="recovery-event is-${event.kind}">
        <span class="recovery-event-index">${String(index + 1).padStart(2, '0')}</span>
        <div><strong>${event.title}</strong><p>${event.detail}</p></div>
        <span class="recovery-event-kind">${event.kind === 'neutral' ? 'event' : event.kind}</span>
      </div>`).join('');
    step.disabled = visible === trace.events.length;
    if (visible === trace.events.length) {
      const passed = trace.checks.every((check) => check.passed);
      result.innerHTML = `<div class="recovery-verdict ${passed ? 'is-pass' : 'is-fail'}"><strong>${passed ? 'Fixture passes' : 'Fixture exposes a failure'}</strong><span>${trace.finalState.effects} effect${trace.finalState.effects === 1 ? '' : 's'} · ${trace.finalState.retries} retr${trace.finalState.retries === 1 ? 'y' : 'ies'}</span></div><div class="recovery-checks">${trace.checks.map((check) => `<span class="${check.passed ? 'is-pass' : 'is-fail'}">${check.passed ? '✓' : '×'} ${check.label}</span>`).join('')}</div>`;
      stop();
    } else {
      result.innerHTML = `<div class="recovery-pending">State at this step <span>${last.state.effects} effect${last.state.effects === 1 ? '' : 's'} recorded</span></div>`;
    }
  }

  function reset() {
    stop();
    trace = makeTrace(select.value, root.querySelector('input:checked').value === 'guarded');
    root.querySelector('.recovery-description').textContent = recoveryFixtures[select.value].description;
    visible = 1;
    render();
  }

  function advance() {
    if (visible < trace.events.length) visible += 1;
    render();
  }

  play.addEventListener('click', () => {
    if (timer) return stop();
    if (visible === trace.events.length) {
      visible = 1;
      render();
    }
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      visible = trace.events.length;
      return render();
    }
    play.textContent = 'Pause replay';
    const tick = () => {
      advance();
      if (visible < trace.events.length) timer = setTimeout(tick, 550);
    };
    timer = setTimeout(tick, 220);
  });
  step.addEventListener('click', () => { stop(); advance(); });
  root.querySelector('.recovery-reset').addEventListener('click', reset);
  select.addEventListener('change', reset);
  root.querySelectorAll('input').forEach((input) => input.addEventListener('change', reset));
  root.querySelector('.recovery-export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(trace, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trace.scenario}-${trace.policy}-synthetic.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  reset();
}
