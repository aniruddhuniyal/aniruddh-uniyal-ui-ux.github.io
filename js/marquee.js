// Two-layer infinite marquee.
// Edit these two arrays to change what shows in each row.
// Row 1 scrolls left, Row 2 scrolls right (set in CSS via .marquee--reverse).

const ROW_1_ITEMS = [
  "Stak", "Docker", "Containers", "Bash", "Windows", "UI/UX", "Frontend", "Backend", "Full Stack"
];

const ROW_2_ITEMS = [
  "Tools", "Claude", "Stitch", "ChatGPT", "Canva", "Figma", "VsCode"
];

const ICON = `<svg viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="4" width="16" height="16" rx="3"></rect>
  <path d="M9 9h6v6H9z"></path>
</svg>`;

function buildTrack(trackEl, items) {
  // Duplicate the list once so translateX(-50%) loops seamlessly.
  const doubled = [...items, ...items];
  trackEl.innerHTML = doubled
    .map(label => `<div class="marquee__item">${ICON}<span>${label}</span></div>`)
    .join("");
}

buildTrack(document.getElementById("track-1"), ROW_1_ITEMS);
buildTrack(document.getElementById("track-2"), ROW_2_ITEMS);