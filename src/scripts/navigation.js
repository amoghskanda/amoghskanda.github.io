import { profile, emailHref } from '../data/profile';

const commands = [
  ['About Amogh · Bosch experience · USC', '#about', 'About'],
  ['Recommendations · manager and mentor · LinkedIn', '#recommendations', 'About'],
  ['Selected engineering work', '#work', 'Section'],
  ['Five interactive workflows', '#workflows', 'Explore'],
  ['Static object detection & ML pipelines', '#case-perception', 'Case study'],
  ['RAG & LLM/VLM pipelines', '#case-labeling', 'Case study'],
  ['ML data pipelines', '#case-pipelines', 'Case study'],
  ['Agentic document comparison · LangGraph · LLMs · FastAPI', '#case-agentic', 'Case study'],
  [`Technical toolkit · ${profile.toolkit.join(' · ')}`, '#main', 'Toolkit'],
  ['Internship experience', '#internships', 'Experience'],
  ['Internship tracker', '#building', 'Side project'],
  ['Agent recovery lab', '#lab', 'Building now'],
  ['Public projects & publication', '#public-work', 'Source'],
  ['Background & education', '#background', 'About'],
  ['Email Amogh', emailHref, 'Contact'],
  ['LinkedIn', profile.linkedin, 'Profile'],
  ['GitHub', profile.github, 'Profile'],
  ['Phone', `tel:${profile.phone}`, 'Contact'],
];

export function initNavigation(dialog) {
  const search = dialog.querySelector('input');
  const results = dialog.querySelector('[data-command-results]');
  function render(query = '') {
    const matches = commands.filter(([label]) => label.toLowerCase().includes(query.toLowerCase()));
    const links = matches.map(([label, href, category]) => {
      const link = document.createElement('a');
      link.href = href;
      const title = document.createElement('span');
      title.textContent = label;
      const type = document.createElement('span');
      type.textContent = `${category} ↗`;
      link.append(title, type);
      link.addEventListener('click', () => dialog.close());
      return link;
    });
    results.replaceChildren(...links);
    if (!links.length) {
      const message = document.createElement('p');
      message.className = 'command-empty';
      message.textContent = 'No matching section. Try work, lab, or contact.';
      results.append(message);
    }
  }
  function open() { search.value = ''; render(); dialog.showModal(); search.focus(); }
  document.querySelectorAll('[data-open-command]').forEach(button => button.addEventListener('click', open));
  dialog.querySelector('[data-close-command]').addEventListener('click', () => dialog.close());
  search.addEventListener('input', () => render(search.value));
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); dialog.open ? dialog.close() : open(); }
  });
}
