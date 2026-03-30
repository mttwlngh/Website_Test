// ---------------------------------------------------------------------------
// Authentication helpers (placeholder logic until backend integration)
const AUTH_KEY = "db_auth";
const AUTH_EMAIL_KEY = "db_email";
const VALID_EMAIL = "matthieu.weinlein@doctorbox.eu";
const VALID_PASSWORD = "1234";

const getCurrentPage = () => document.body?.dataset?.page || "";

const isAuthenticated = () => localStorage.getItem(AUTH_KEY) === "true";

const login = (email, password) => {
  const normalizedEmail = email.trim().toLowerCase();
  const isValid =
    normalizedEmail === VALID_EMAIL && password === VALID_PASSWORD;

  if (isValid) {
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(AUTH_EMAIL_KEY, normalizedEmail);
    return { success: true };
  }

  return {
    success: false,
    message: "E-Mail oder Passwort ist ungültig.",
  };
};

const logout = () => {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(AUTH_EMAIL_KEY);
  window.location.href = "login.html";
};

const enforceAuthGuards = () => {
  const page = getCurrentPage();
  if (page === "instructions" && !isAuthenticated()) {
    window.location.href = "login.html";
    return;
  }

  if (page === "login" && isAuthenticated()) {
    window.location.href = "index.html";
  }
};

enforceAuthGuards();

const applyNavAuthCta = () => {
  const authLink = document.querySelector("[data-auth-link], .nav-login");
  if (!authLink) return;

  if (isAuthenticated()) {
    authLink.textContent = "Logout";
    authLink.setAttribute("href", "#logout");
    authLink.setAttribute("role", "button");
    authLink.addEventListener("click", (event) => {
      event.preventDefault();
      logout();
    });
  } else {
    authLink.textContent = "Login";
    authLink.removeAttribute("role");
    authLink.setAttribute("href", "login.html");
  }
};

applyNavAuthCta();

const loginForm = document.querySelector("#login-form");
if (loginForm) {
  const loginError = document.querySelector("#login-error");
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(loginForm);
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";

    const result = login(email, password);
    if (result.success) {
      if (loginError) {
        loginError.textContent = "";
        loginError.hidden = true;
      }
      window.location.href = "index.html";
    } else if (loginError) {
      loginError.textContent = result.message;
      loginError.hidden = false;
    }
  });
}

// ---------------------------------------------------------------------------
// Tab interactions
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

// ---------------------------------------------------------------------------
// i18n — DE / EN language switcher
// ---------------------------------------------------------------------------
const TRANSLATIONS = {
  de: {
    // Page header
    "page.title": "Anleitungen für Testkits",
    "page.subtitle": "Wähle das passende Testkit und folge den Schritten.",
    // Category buttons
    "cat.sti": "STI-Testkits",
    "cat.vorsorge": "Vorsorgetests",
    // Placeholder
    "placeholder.title": "Test auswählen",
    "placeholder.body": "Bitte wähle oben ein Testkit, um die Anleitung zu sehen.",
    // Support section
    "support.title": "Brauchst du Hilfe bei deinem Testkit?",
    "support.body": "Matthieu ist für dich da. Wir melden uns werktags innerhalb von 24 Stunden.",
    "support.cta": "E-Mail schreiben",
    // Lang toggle label (shows what you will switch TO)
    "lang.toggle": "EN",
  },
  en: {
    // Page header
    "page.title": "Instructions for Test Kits",
    "page.subtitle": "Select the right test kit and follow the steps.",
    // Category buttons
    "cat.sti": "STI Test Kits",
    "cat.vorsorge": "Preventive Tests",
    // Placeholder
    "placeholder.title": "Select a test",
    "placeholder.body": "Please select a test kit above to view the instructions.",
    // Support section
    "support.title": "Need help with your test kit?",
    "support.body": "Matthieu is here for you. We respond on weekdays within 24 hours.",
    "support.cta": "Send an email",
    // Lang toggle label
    "lang.toggle": "DE",

    // --- Tab labels (gender toggles, sub-tabs) ---
    // These are set directly via DOM walking because they are generated
    // from data attributes; we map by innerText (trimmed)
  },
};

// Pill-button / tab-button texts that need to swap
const PILL_TEXT_MAP = {
  de: {
    "💧 Urin & 🩸 Trockenblut": "💧 Urin & 🩸 Trockenblut",
    "🧪 Vaginalabstrich & 🩸 Trockenblut": "🧪 Vaginalabstrich & 🩸 Trockenblut",
    // sub-tabs
    "GWQ": "GWQ",
    "KKH": "KKH",
    // vorsorge tabs (tab-buttons already named in English or abbreviation)
  },
  en: {
    "💧 Urin & 🩸 Trockenblut": "💧 Urine & 🩸 Dry Blood",
    "🧪 Vaginalabstrich & 🩸 Trockenblut": "🧪 Vaginal Swab & 🩸 Dry Blood",
    "GWQ": "GWQ",
    "KKH": "KKH",
  },
};

// Step-card translations: [DE text] → [EN text]
const STEP_BODY_MAP = {
  "Versandbeutel (Labor Krone) ins Testkit legen.":
    "Place shipping bag (Labor Krone) into the test kit.",
  "Versandbeutel (Labor Becker) ins Testkit legen.":
    "Place shipping bag (Labor Becker) into the test kit.",
  "Testkit in den gekennzeichneten braunen Versandbeutel legen.":
    "Place the test kit into the labelled brown shipping bag.",
  "Testkit in den Versandbeutel legen.":
    "Place the test kit into the shipping bag.",
  "Testkit in den Versandbeutel geben.":
    "Place the test kit into the shipping bag.",
  "Anleitungsheft als letztes obenauf platzieren.":
    "Place the instruction booklet on top last.",
  "Anleitungsheft obenauf legen.":
    "Place the instruction booklet on top.",
  "Anleitungsheft obenauf platzieren.":
    "Place the instruction booklet on top.",
  "Anleitungsheft (GWQ) obenauf platzieren.":
    "Place the instruction booklet (GWQ) on top.",
  "Barcodekarte zuschneiden und ins Testkit legen.":
    "Cut out the barcode card and place it into the test kit.",
  "Barcodekarte ins Testkit legen.":
    "Place the barcode card into the test kit.",
  "Handschuh ins Testkit legen.":
    "Place the glove into the test kit.",
  "Stuhlauffanghilfe und Handschuh ins Testkit legen.":
    "Place the stool collection aid and glove into the test kit.",
};

// Step-body fragments (for sentences with <strong> tags we translate the surrounding text too)
const STEP_HINT_MAP = {
  "Hinweis: Danach das Blutentnahmeset verschließen und ins Testkit geben.":
    "Note: Then close the blood collection set and place it into the test kit.",
  "Wichtig: Gleicher Code wie die Barcodes vom Röhrchen und Beutel.":
    "Important: Same code as the barcodes on the tube and bag.",
};

// Pack-steps headers
const PACK_HEADER_MAP = {
  "Pack-Anleitung": "Packing Instructions",
  "So packst du das STI Pro Testkit Schritt für Schritt.":
    "Pack the STI Pro test kit step by step.",
  "Schritte für den STI Standard (Urin & Trockenblut) Kit.":
    "Steps for the STI Standard (Urine & Dry Blood) kit.",
  "Schritte für den STI Standard (Vaginalabstrich & Trockenblut) Kit.":
    "Steps for the STI Standard (Vaginal Swab & Dry Blood) kit.",
  "Schritte für das Darmkrebsvorsorge (GWQ) Kit.":
    "Steps for the Colorectal Cancer Screening (GWQ) kit.",
};

// Section headings (h3, h4) inside tab panels
const HEADING_MAP = {
  "Pack-Anleitung": "Packing Instructions",
  "Komponenten für Urin & Trockenblut": "Components for Urine & Dry Blood",
  "Komponenten für Vaginalabstrich & Trockenblut": "Components for Vaginal Swab & Dry Blood",
  "Komponenten für Trockenblut": "Components for Dry Blood",
  "Komponenten (GWQ)": "Components (GWQ)",
  "Komponenten (KKH)": "Components (KKH)",
  "Komponenten": "Components",
};

// Component list items (li text — contains "1 x …")
const COMPONENT_MAP = {
  "1 x Versandbeutel (Labor Krone)": "1 x Shipping Bag (Labor Krone)",
  "1 x Versandbeutel (Labor Becker)": "1 x Shipping Bag (Labor Becker)",
  "1 x Braune Versandtüte": "1 x Brown Shipping Envelope",
  "1 x Großer Blauer Beutel mit Saugeinlage": "1 x Large Blue Bag with Absorbent Pad",
  "1 x Kleiner Blauer Beutel mit Saugeinlage": "1 x Small Blue Bag with Absorbent Pad",
  "1 x Urinbecher": "1 x Urine Cup",
  "1 x Urine Specimen Collection Kit": "1 x Urine Specimen Collection Kit",
  "1 x Vaginalabstrich": "1 x Vaginal Swab",
  "1 x Handschuh": "1 x Glove",
  "1 x Trockenblutkarte": "1 x Dry Blood Card",
  "3x Lanzetten": "3x Lancets",
  "2x Pflaster": "2x Plasters",
  "2x Alkoholtupfer": "2x Alcohol Swabs",
  "1 x Wundkompresse": "1 x Wound Compress",
  "1 x Stuhlauffanghilfe": "1 x Stool Collection Aid",
  "1 x Röhrchen": "1 x Tube",
  "1 x Barcodekarte": "1 x Barcode Card",
  "1 x GWQ Anleitungsheft": "1 x GWQ Instruction Booklet",
  "1 x KKH Anleitungsheft": "1 x KKH Instruction Booklet",
  "1 x Anleitungsheft": "1 x Instruction Booklet",
  "1 x Grünes Anleitungsheft (Urin, Trockenblut, Rektal)":
    "1 x Green Instruction Booklet (Urine, Dry Blood, Rectal)",
  "1 x Beiges Anleitungsheft": "1 x Beige Instruction Booklet",
  "1 x Blutentnahmeset": "1 x Blood Collection Set",
};

// Tab button labels (Vorsorge tabs that have German text)
const TAB_LABEL_MAP = {
  "PSA Vorsorge": "PSA Screening",
  "Vitamin D": "Vitamin D",
  "Blutzucker (HbA1c)": "Blood Sugar (HbA1c)",
  "Darmkrebsvorsorge": "Colorectal Cancer Screening",
  "STI Pro": "STI Pro",
  "STI Standard": "STI Standard",
  "STI Essential": "STI Essential",
  "STI Select": "STI Select",
  "STI Basic": "STI Basic",
  "HPV Test": "HPV Test",
};

// Tab h3 headings
const TAB_H3_MAP = {
  "STI Pro": "STI Pro",
  "STI Standard": "STI Standard",
  "STI Essential": "STI Essential",
  "STI Select": "STI Select",
  "STI Basic": "STI Basic",
  "HPV Test": "HPV Test",
  "PSA Vorsorge": "PSA Screening",
  "Vitamin D": "Vitamin D",
  "Blutzucker (HbA1c)": "Blood Sugar (HbA1c)",
  "Darmkrebsvorsorge": "Colorectal Cancer Screening",
};

// gender-note paragraphs
const GENDER_NOTE_MAP = {
  "Schritte für den STI Standard (Urin & Trockenblut) Kit.":
    "Steps for the STI Standard (Urine & Dry Blood) kit.",
  "Schritte für den STI Standard (Vaginalabstrich & Trockenblut) Kit.":
    "Steps for the STI Standard (Vaginal Swab & Dry Blood) kit.",
};

// Schritt N label
const STEP_TITLE_RE = /^Schritt (\d+)$/;

// ---- helpers ----------------------------------------------------------------

const reverseMap = (map) =>
  Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));

let currentLang = document.documentElement.dataset.lang || "de";

const getText = (map, key) => {
  const sourceLang = currentLang === "en" ? "de" : "en"; // where we come FROM
  // If we are translating TO en, look up DE key → EN value
  // If we are translating back TO de, look up EN key → DE value (reverse)
  if (currentLang === "en") return map[key] ?? key;
  return reverseMap(map)[key] ?? key;
};

// Because we always translate in the direction currentLang points to AFTER toggle,
// simplify: applyTranslations always takes the TARGET lang as argument.

const applyTranslations = (lang) => {
  // 1. data-i18n elements
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    const text = TRANSLATIONS[lang][key];
    if (text !== undefined) el.textContent = text;
  });

  // 2. Step titles "Schritt N" → "Step N"
  document.querySelectorAll(".step-title").forEach((el) => {
    const m = el.textContent.trim().match(/^(Schritt|Step) (\d+)$/);
    if (!m) return;
    el.textContent = lang === "en" ? `Step ${m[2]}` : `Schritt ${m[2]}`;
  });

  // 3. Step bodies (text nodes only — preserve <strong> tags)
  document.querySelectorAll(".step-body").forEach((el) => {
    // We translate only if the element has just a single text node (no complex markup)
    // For complex markup we skip — the barcode labels / strong tags are language-neutral
    const combined = el.innerText.trim();
    const deMap = STEP_BODY_MAP;
    const enMap = reverseMap(deMap);
    const lookup = lang === "en" ? deMap : enMap;
    if (lookup[combined]) {
      // simple text node element — safe to replace
      el.textContent = lookup[combined];
    }
  });

  // 4. Step hints
  document.querySelectorAll(".step-hint").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = STEP_HINT_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 5. Pack-steps headers (h4 + p inside .pack-steps-header)
  document.querySelectorAll(".pack-steps-header h4").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = PACK_HEADER_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });
  document.querySelectorAll(".pack-steps-header p").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = PACK_HEADER_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 6. info-box h4 (strip the emoji icon badge first, then compare)
  document.querySelectorAll(".info-box h4").forEach((el) => {
    const badge = el.querySelector(".icon-badge");
    const badgeText = badge ? badge.outerHTML : "";
    const rawText = el.textContent.replace(badge?.textContent ?? "", "").trim();
    const enMap = HEADING_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[rawText]) {
      el.innerHTML = badgeText + " " + lookup[rawText];
    }
  });

  // 7. Component list items
  document.querySelectorAll(".info-box ul > li").forEach((el) => {
    // only translate top-level li (ignore nested sub-list items handled below)
    if (el.closest("ul")?.closest("li")) return; // skip sub-list items
    const nestedUl = el.querySelector("ul");
    const directText = el.childNodes[0]?.textContent?.trim() ?? "";
    const enMap = COMPONENT_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[directText]) {
      el.childNodes[0].textContent = lookup[directText] + (nestedUl ? "\n" : "");
    }
  });
  // sub-list items
  document.querySelectorAll(".info-box ul > li > ul > li").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = COMPONENT_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 8. Tab button labels (for Vorsorge + STI)
  document.querySelectorAll(".tab-button").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = TAB_LABEL_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 9. Tab panel h3 headings
  document.querySelectorAll(".tab-panel > h3").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = TAB_H3_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 10. Pill buttons (gender toggles)
  document.querySelectorAll(".pill-button").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = PILL_TEXT_MAP.en;
    const deMap = PILL_TEXT_MAP.de;
    const lookup = lang === "en" ? { ...enMap } : { ...deMap };
    // build reverse: en→de for de switch
    if (lang === "en" && enMap[t] !== undefined) {
      el.textContent = enMap[t];
    } else if (lang === "de") {
      // find key in en map whose value matches t
      const deKey = Object.keys(enMap).find((k) => enMap[k] === t);
      if (deKey) el.textContent = deKey;
    }
  });

  // 11. gender-note paragraphs
  document.querySelectorAll(".gender-note").forEach((el) => {
    const t = el.textContent.trim();
    const enMap = GENDER_NOTE_MAP;
    const deMap = reverseMap(enMap);
    const lookup = lang === "en" ? enMap : deMap;
    if (lookup[t]) el.textContent = lookup[t];
  });

  // 12. html lang attribute
  document.documentElement.lang = lang;
  document.documentElement.dataset.lang = lang;

  currentLang = lang;
};

// Wire up the button
const langToggleBtn = document.getElementById("lang-toggle");
if (langToggleBtn) {
  langToggleBtn.addEventListener("click", () => {
    const nextLang = currentLang === "de" ? "en" : "de";
    applyTranslations(nextLang);
    langToggleBtn.textContent = TRANSLATIONS[nextLang]["lang.toggle"];
  });
}
