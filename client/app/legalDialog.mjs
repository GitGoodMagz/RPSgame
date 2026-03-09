import { t } from "./i18n.mjs";

export function openLegalDialog(doc) {
  const dialog = document.getElementById("legalDialog");
  const frame = document.getElementById("legalFrame");
  const title = document.getElementById("legalTitle");
  if (!dialog || !frame || !title) return;

  if (doc === "privacy") {
    frame.src = "./dataPrivacyPolicy.html";
    title.textContent = t("shell.legalTitlePrivacy");
  } else {
    frame.src = "./ToS.html";
    title.textContent = t("shell.legalTitleTerms");
  }

  if (typeof dialog.showModal === "function") dialog.showModal();
}

export function setupLegalDialogTabs() {
  const dialog = document.getElementById("legalDialog");
  if (!dialog) return;

  const tabButtons = Array.from(dialog.querySelectorAll("button[data-doc]"));
  for (const btn of tabButtons) {
    btn.addEventListener("click", () => {
      const doc = btn.getAttribute("data-doc") || "tos";
      openLegalDialog(doc);
    });
  }
}
