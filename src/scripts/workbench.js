import { projects, initialProject, getWorkflow } from '../data/projects';
import { diagramMarkup } from '../lib/workflow-diagram';

export function initWorkbench(root) {
  let selectedProject = initialProject;
  let selectedFlow = 'image';
  let selectedStage = 0;
  let inspectorTab = 'overview';
  let timer;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 580px)');
  const diagram = root.querySelector('[data-pipeline]');
  const inspector = root.querySelector('[data-inspector]');
  const replayButton = root.querySelector('[data-replay]');
  const tabs = [...root.querySelectorAll('[data-inspect]')];
  const workflow = () => getWorkflow(selectedProject, selectedFlow);

  function stopReplay() {
    clearInterval(timer);
    timer = undefined;
    replayButton.textContent = '↻';
    replayButton.setAttribute('aria-label', 'Replay workflow');
    replayButton.title = 'Replay workflow';
  }

  function renderInspector(stageMode = false) {
    const project = workflow();
    const label = stageMode ? project.stages[selectedStage][0] : { overview: 'The work', decisions: 'The approach', evidence: 'Source & status' }[inspectorTab];
    const copy = stageMode ? project.stages[selectedStage][2] : project[inspectorTab];
    inspector.setAttribute('aria-live', timer ? 'off' : 'polite');
    inspector.setAttribute('aria-atomic', 'true');
    const heading = document.createElement('span');
    heading.className = 'inspector-label';
    heading.textContent = label;
    const paragraph = document.createElement('p');
    paragraph.textContent = copy;
    if (inspectorTab === 'evidence' && !stageMode) {
      const link = document.createElement('a');
      link.href = `#${project.anchor}`;
      link.textContent = 'Read more ↗';
      paragraph.append(' ', link);
    }
    inspector.replaceChildren(heading, paragraph);
  }

  function renderDiagram(focusStage) {
    const project = workflow();
    diagram.innerHTML = diagramMarkup(project, selectedStage, compact.matches);
    diagram.setAttribute('aria-label', `${project.title}: conceptual workflow`);
    if (Number.isInteger(focusStage)) diagram.querySelector(`[data-stage="${focusStage}"]`)?.focus();
  }

  function chooseStage(index, restoreFocus = false) {
    stopReplay();
    selectedStage = index;
    renderDiagram(restoreFocus ? index : undefined);
    renderInspector(true);
  }

  diagram.addEventListener('click', event => {
    const node = event.target.closest('[data-stage]');
    if (node) chooseStage(Number(node.dataset.stage), document.activeElement === node);
  });
  diagram.addEventListener('keydown', event => {
    const node = event.target.closest('[data-stage]');
    if (!node) return;
    const count = workflow().stages.length;
    let index = Number(node.dataset.stage);
    if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = count - 1;
    else if (event.key === 'ArrowRight') index = (index + 1) % count;
    else if (event.key === 'ArrowLeft') index = (index - 1 + count) % count;
    else if (!['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    chooseStage(index, true);
  });

  function selectProject(key) {
    if (!projects[key]) return;
    stopReplay();
    selectedProject = key;
    selectedStage = 0;
    const project = workflow();
    root.querySelectorAll('[data-project]').forEach(button => {
      const active = button.dataset.project === key;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    root.querySelector('[data-project-number]').textContent = project.number;
    root.querySelector('[data-project-kind]').textContent = project.kind;
    root.querySelector('[data-project-title]').textContent = project.title;
    root.querySelector('[data-workflow-options]').hidden = key !== 'perception';
    root.querySelectorAll('[data-perception-flow]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.perceptionFlow === selectedFlow)));
    root.querySelector('[data-workflow-context]').textContent = project.contextNote;
    renderDiagram();
    renderInspector();
  }

  root.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', event => {
    selectProject(button.dataset.project);
    if (event.detail > 0) root.querySelector('[data-project-preview]').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  }));
  root.querySelectorAll('[data-perception-flow]').forEach(button => button.addEventListener('click', () => { selectedFlow = button.dataset.perceptionFlow; selectProject('perception'); }));
  tabs.forEach((button, index) => {
    button.addEventListener('click', () => {
      inspectorTab = button.dataset.inspect;
      tabs.forEach(tab => { tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; });
      inspector.setAttribute('aria-labelledby', button.id);
      renderInspector();
    });
    button.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.click(); next.focus();
    });
  });
  root.querySelector('[data-step]').addEventListener('click', () => chooseStage((selectedStage + 1) % workflow().stages.length));
  replayButton.addEventListener('click', () => {
    if (timer) { stopReplay(); return; }
    if (reducedMotion.matches) { chooseStage(workflow().stages.length - 1); return; }
    selectedStage = 0;
    renderDiagram();
    renderInspector(true);
    replayButton.textContent = 'Ⅱ';
    replayButton.setAttribute('aria-label', 'Pause workflow replay');
    replayButton.title = 'Pause workflow replay';
    timer = setInterval(() => {
      selectedStage += 1;
      if (selectedStage === workflow().stages.length - 1) stopReplay();
      renderDiagram(); renderInspector(true);
    }, 1250);
  });
  compact.addEventListener('change', () => renderDiagram());
  reducedMotion.addEventListener('change', stopReplay);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopReplay(); });
  root.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      if (reducedMotion.matches || event.pointerType !== 'mouse') return;
      const bounds = button.getBoundingClientRect();
      const x = Math.max(-4, Math.min(4, (event.clientX - bounds.left - bounds.width / 2) / 12));
      const y = Math.max(-3, Math.min(3, (event.clientY - bounds.top - bounds.height / 2) / 8));
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    button.addEventListener('focus', () => { button.style.transform = ''; });
  });
  selectProject(initialProject);
}
