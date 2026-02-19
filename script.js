const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");

const setActiveTab = (tabId) => {
  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabId);
  });

  tabPanels.forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.tab === tabId);
  });
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveTab(button.dataset.tab);
  });
});

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
