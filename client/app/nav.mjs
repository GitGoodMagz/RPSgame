import { state } from "./state.mjs";

const createViewFile = "./createUser.html";
const manageViewFile = "./manageUser.html";

export function checkCreateView() {
  return (
    location.pathname.endsWith("/createUser.html") ||
    location.pathname === "/" ||
    location.pathname.endsWith("/index.html")
  );
}

export function checkManageView() {
  return location.pathname.endsWith("/manageUser.html");
}

export function wireNavigation() {
  const createTab = document.querySelector('[data-nav="create"]');
  const manageTab = document.querySelector('[data-nav="manage"]');

  if (createTab) {
    createTab.addEventListener("click", () => {
      if (!checkCreateView()) location.href = createViewFile;
    });
  }

  if (manageTab) {
    manageTab.addEventListener("click", () => {
      if (state.users.length === 0) return;
      if (!checkManageView()) location.href = manageViewFile;
    });
  }
}
