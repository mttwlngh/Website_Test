const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const categoryButtons = document.querySelectorAll(".category-btn");
const testCategories = document.querySelectorAll(".test-category");
const placeholderPanel = document.querySelector(".tab-placeholder");

let activeCategory =
  document.querySelector(".category-btn.active")?.dataset.categoryTarget ||
  categoryButtons[0]?.dataset.categoryTarget ||
  "sti";
let activeKitId = null;

const applyCategoryState = () => {
  categoryButtons.forEach((button) => {
    const isActive = button.dataset.categoryTarget === activeCategory;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  testCategories.forEach((section) => {
    section.classList.toggle("active", section.dataset.category === activeCategory);
  });
};

const applyKitState = () => {
  tabButtons.forEach((button) => {
    const isActive = button.dataset.tab === activeKitId;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  tabPanels.forEach((panel) => {
    const isActive = panel.dataset.tab === activeKitId;
    panel.classList.toggle("active", isActive);
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  if (placeholderPanel) {
    placeholderPanel.classList.toggle("active", !activeKitId);
  }
};

const setCategory = (category, { resetSelection = true } = {}) => {
  if (!category) return;
  activeCategory = category;

  if (resetSelection) {
    activeKitId = null;
  }

  applyCategoryState();
  applyKitState();
};

const setActiveTab = (tabId) => {
  if (!tabId) return;

  const targetButton = Array.from(tabButtons).find(
    (button) => button.dataset.tab === tabId
  );

  if (!targetButton) return;

  const category = targetButton.dataset.category;
  if (category && category !== activeCategory) {
    setCategory(category, { resetSelection: false });
  }

  activeKitId = tabId;
  applyKitState();
};

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setCategory(button.dataset.categoryTarget);
  });
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tab);
  });
});

setCategory(activeCategory);

const setActiveGender = (container, gender) => {
  const buttons = container.querySelectorAll(".pill-button");
  const panels = container.parentElement.querySelectorAll(".gender-panel");

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.gender === gender);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.gender === gender);
  });
};

document.querySelectorAll(".gender-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const target = event.target.closest(".pill-button");
    if (!target) return;

    setActiveGender(toggle, target.dataset.gender);
  });
});

const setActiveSubtab = (container, subtab) => {
  const buttons = container.querySelectorAll(".pill-button");
  const panels = container.parentElement.querySelectorAll(".sub-panel");

  buttons.forEach((button) => {
    button.classList.toggle("active", button.dataset.subtab === subtab);
  });

  panels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.subtab === subtab);
  });
};

document.querySelectorAll(".sub-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (event) => {
    const target = event.target.closest(".pill-button");
    if (!target) return;

    setActiveSubtab(toggle, target.dataset.subtab);
  });
});

// Navigation links: activate tab and scroll into view
document.querySelectorAll("[data-target]").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = link.dataset.target; // e.g. 'sti-pro'
    // activate tab
    setActiveTab(target);
    // find the panel id and scroll into view
    const panel = document.querySelector(`#tab-${target}`);
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // close any open dropdowns
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
    // close mobile nav if open
    const header = document.querySelector('.site-header');
    if (header && header.classList.contains('open')) header.classList.remove('open');
  });
});

// Make `.no-action` links inert (do nothing on click)
document.querySelectorAll('a.no-action').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
  });
});

// Smooth-scroll for nav boxes so anchors stop below sticky header
const navLinks = document.querySelectorAll('.nav-box[href^="#"]');
const stickyHeader = document.querySelector('.site-header');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    const target = document.querySelector(hash);
    if (!target) return;

    event.preventDefault();

    const headerOffset = stickyHeader?.offsetHeight ?? 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerOffset - 10;

    window.scrollTo({ top, behavior: 'smooth' });

    navLinks.forEach((navLink) => {
      navLink.classList.toggle('active', navLink === link);
    });
  });
});

// open/close dropdown on click (desktop friendly)
// dropdown/hamburger JS removed — topbar is minimal 'Anleitungen'
