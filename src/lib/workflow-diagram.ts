import type { Project } from '../data/projects';

export function escapeHTML(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const icons = [
  '<rect x="-10" y="-7" width="20" height="14" rx="3"/><circle cx="0" cy="0" r="4"/><path d="M-6-10h12"/>',
  '<path d="M-10-5l10-5 10 5L0 0zM-10 1L0 6l10-5M-10 7l10 5 10-5"/>',
  '<path d="M-10-3v-7h7M3-10h7v7M10 3v7H3M-3 10h-7V3"/><circle r="4"/>',
  '<path d="M0-11l10 6v11L0 12l-10-6V-5zM0 1v11M-10-5L0 1l10-6M0-11V1"/>',
  '<circle r="10"/><path d="M-5 0l3 3 7-7"/>',
];
const documentIcons = [
  '<path d="M-8-11H3l6 6v16H-8zM3-11v7h6M-4 1h8M-4 5h8"/>',
  '<rect x="-4" y="-4" width="8" height="8" rx="2"/><path d="M-4 0h-7V-8h4M4 0h7v8H7M0-4v-7M0 4v7"/>',
  '<path d="M-10-6h7v12h-7zM3-6h7v12H3M-1-3l2 3-2 3"/>',
  '<rect x="-8" y="-9" width="16" height="20" rx="2"/><path d="M-4-10h8v4h-8zM-4 2l3 3 5-6"/>',
];

export function diagramMarkup(project: Project, stage: number, compact = false): string {
  const count = project.stages.length;
  const stageIcons = project.anchor === 'case-agentic' ? documentIcons : icons;
  const width = compact ? 320 : 500;
  const height = compact ? Math.ceil(count / 2) * 145 + 35 : count <= 4 ? 240 : Math.ceil(count / 3) * 165 + 35;
  const positions = project.stages.map((_, index) => {
    if (compact) {
      const row = Math.floor(index / 2);
      const column = row % 2 ? 1 - index % 2 : index % 2;
      return { x: 65 + column * 180, y: 80 + row * 145 };
    }
    if (count <= 4) return { x: 55 + index * 130, y: [127, 93, 145, 105][index]! };
    const row = Math.floor(index / 3);
    const column = row % 2 ? 2 - index % 3 : index % 3;
    return { x: 65 + column * 185, y: 80 + row * 165 };
  });
  const nodes = project.stages.map(([title, subtitle, detail], index) => `<g class="pipeline-node ${index === stage ? 'node-active' : ''}" role="button" tabindex="0" aria-label="${escapeHTML(`${title}: ${detail}`)}" aria-pressed="${index === stage}" data-stage="${index}" transform="translate(${positions[index]!.x},${positions[index]!.y})"><rect class="node-body" x="-46" y="-39" width="92" height="78" rx="7"/><text class="node-number" x="-33" y="-25">${String(index + 1).padStart(2, '0')}</text><g class="node-icon" transform="translate(0,-3)">${stageIcons[index % stageIcons.length]}</g><text class="node-title" x="0" y="26" text-anchor="middle">${escapeHTML(title)}</text><text class="node-subtitle" x="0" y="62" text-anchor="middle">${escapeHTML(subtitle)}</text>${index === stage ? '<circle class="node-selected-dot" cx="34" cy="-26" r="2.5"/>' : ''}</g>`).join('');
  const lines = positions.slice(0, -1).map((from, index) => {
    const to = positions[index + 1]!;
    const direction = to.x === from.x ? (from.x > width / 2 ? 1 : -1) : Math.sign(to.x - from.x);
    const path = to.x === from.x
      ? `M${from.x + direction * 46} ${from.y} C${from.x + direction * 64} ${from.y} ${to.x + direction * 64} ${to.y} ${to.x + direction * 46} ${to.y}`
      : `M${from.x + direction * 46} ${from.y} C${from.x + direction * 69} ${from.y} ${to.x - direction * 69} ${to.y} ${to.x - direction * 46} ${to.y}`;
    return `<path class="diagram-line ${index < stage ? 'diagram-line-active' : ''}" d="${path}"/>`;
  }).join('');
  return `<svg class="pipeline-svg" viewBox="0 0 ${width} ${height}" role="group" aria-label="${escapeHTML(project.title)}: conceptual workflow"><ellipse class="diagram-orbit" cx="${width / 2}" cy="${height / 2}" rx="${width / 2 - 19}" ry="${height / 2 - 37}"/><ellipse class="diagram-orbit" cx="${width / 2}" cy="${height / 2}" rx="${width / 2 - 80}" ry="${height / 2 - 12}"/>${lines}${nodes}<text class="node-subtitle" x="${width / 2}" y="${height - 13}" text-anchor="middle">${stage + 1} / ${count} · ${escapeHTML(project.stages[stage]![0])}</text></svg>`;
}
