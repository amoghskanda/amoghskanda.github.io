import { internshipTopics } from '../data/internships';

export function initInternship(root) {
  const topics = internshipTopics;
  let topicKey = 'scene';
  let stage = 0;
  const tabs = [...root.querySelectorAll('[data-internship-topic]')];
  const image = root.querySelector('[data-tool-image]');
  const placeholder = root.querySelector('.tool-demo-placeholder');
  const stopButton = root.querySelector('[data-tool-stop]');

  function stopDemo() {
    image.hidden = true;
    image.removeAttribute('src');
    placeholder.hidden = false;
    stopButton.hidden = true;
  }

  function renderStage(restoreFocus = false) {
    const topic = topics[topicKey];
    const stages = root.querySelector('[data-internship-stages]');
    stages.style.setProperty('--stage-count', topic.stages.length);
    stages.innerHTML = topic.stages.map(([title, subtitle], index) => `<button type="button" data-internship-stage="${index}" aria-pressed="${stage === index}"><span>${String(index + 1).padStart(2, '0')}</span><strong>${title}</strong><small>${subtitle}</small><span class="stage-connection" aria-hidden="true">→</span></button>`).join('');
    const [title, , copy] = topic.stages[stage];
    root.querySelector('[data-internship-stage-label]').textContent = `${String(stage + 1).padStart(2, '0')} / ${title}`;
    root.querySelector('[data-internship-stage-copy]').textContent = copy;
    stages.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => { stage = Number(button.dataset.internshipStage); renderStage(true); });
      button.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'Home') stage = 0;
        else if (event.key === 'End') stage = topic.stages.length - 1;
        else stage = (stage + (event.key === 'ArrowRight' ? 1 : -1) + topic.stages.length) % topic.stages.length;
        renderStage(true);
      });
    });
    if (restoreFocus) stages.querySelector(`[data-internship-stage="${stage}"]`).focus();
  }

  function selectTopic(key) {
    topicKey = key;
    stage = 0;
    stopDemo();
    const topic = topics[key];
    tabs.forEach(tab => {
      const active = tab.dataset.internshipTopic === key;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    root.querySelector('[role="tabpanel"]').setAttribute('aria-labelledby', key === 'scene' ? 'intern-scene-tab' : 'intern-data-tab');
    for (const field of ['category', 'title', 'summary', 'contribution']) root.querySelector(`[data-internship-${field}]`).textContent = topic[field];
    root.querySelector('[data-internship-side-note]').textContent = topic.note;
    root.querySelector('[data-internship-tags]').innerHTML = topic.tags.map(tag => `<span>${tag}</span>`).join('');
    root.querySelector('[data-internship-scene]').hidden = key !== 'scene';
    root.querySelector('[data-internship-fiftyone]').hidden = key !== 'data';
    renderStage();
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectTopic(tab.dataset.internshipTopic));
    tab.addEventListener('keydown', event => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? tabs[0] : event.key === 'End' ? tabs.at(-1) : tabs[(index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      selectTopic(next.dataset.internshipTopic);
      next.focus();
    });
  });
  root.querySelector('[data-internship-next]').addEventListener('click', () => { stage = (stage + 1) % topics[topicKey].stages.length; renderStage(); });
  root.querySelector('[data-tool-play]').addEventListener('click', () => {
    image.src = image.dataset.src || '';
    image.hidden = false;
    placeholder.hidden = true;
    stopButton.hidden = false;
    stopButton.focus();
  });
  stopButton.addEventListener('click', () => { stopDemo(); root.querySelector('[data-tool-play]').focus(); });
  image.addEventListener('error', () => {
    stopDemo();
    placeholder.querySelector('p').textContent = 'The image could not load. The documentation link below opens the official tool guide.';
  });
  selectTopic('scene');
}
