import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
} from './aem.js';

function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    if (h1.closest('.hero-banner') || picture.closest('.hero-banner')) return;
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
}

function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) { /* skip */ }
}

function decorateButtons(main) {
  main.querySelectorAll('p a[href]').forEach((a) => {
    a.title = a.title || a.textContent;
    const p = a.closest('p');
    const text = a.textContent.trim();
    if (a.querySelector('img') || p.textContent.trim() !== text) return;
    try { if (new URL(a.href).href === new URL(text, window.location).href) return; } catch { /* continue */ }
    const strong = a.closest('strong');
    const em = a.closest('em');
    if (!strong && !em) return;
    p.className = 'button-wrapper';
    a.className = 'button';
    if (strong) { a.classList.add('primary'); strong.replaceWith(a); }
    else if (em) { a.classList.add('secondary'); em.replaceWith(a); }
  });
}

/**
 * Assigns IDs to sections based on the block they contain,
 * enabling anchor navigation (e.g. #roster, #schedule).
 */
function decorateSectionIds(main) {
  const usedIds = new Set();
  main.querySelectorAll('.section').forEach((section) => {
    if (section.id) { usedIds.add(section.id); return; }
    const block = section.querySelector('[data-block-name]');
    if (block) {
      const name = block.dataset.blockName;
      if (name && !usedIds.has(name)) {
        // Remove conflicting heading IDs so section gets the anchor
        const conflicting = section.querySelector(`#${name}`);
        if (conflicting && conflicting.tagName.match(/^H[1-6]$/)) {
          conflicting.removeAttribute('id');
        }
        section.id = name;
        usedIds.add(name);
      }
    }
  });
}


export function decorateMain(main) {
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
  decorateButtons(main);
  decorateSectionIds(main);
}

async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await loadSection(main.querySelector('.section'), waitForFirstImage);
  }
}

async function loadLazy(doc) {
  loadHeader(doc.querySelector('header'));
  const main = doc.querySelector('main');
  await loadSections(main);
  loadFooter(doc.querySelector('footer'));
  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

function loadDelayed() {
  window.setTimeout(() => import('./delayed.js'), 3000);
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
