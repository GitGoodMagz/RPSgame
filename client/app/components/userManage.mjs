import { state, notify, subscribe } from "../state.mjs";
import { saveSession } from "../auth.mjs";
import { UserService } from "../userService.mjs";
import { PlayService } from "../playService.mjs";
import { getTemplate, getField, createElement, formatMeta } from "../dom.mjs";
import { clearAppSession, syncNavAvailability } from "../users.mjs";
import { setView } from "../nav.mjs";
import { t } from "../i18n.mjs";

function emptyStats() {
  return {
    totalPlays: 0,
    wins: 0,
    losses: 0,
    draws: 0
  };
}

export class ManageUser extends HTMLElement {
  connectedCallback() {
    const fragment = getTemplate("manageTemplate").content.cloneNode(true);
    this.replaceChildren(fragment);

    this.pageLogoutButton = document.getElementById("accountLogoutButton");

    this.emptyState = getField(this, "emptyState");
    this.emptyText = getField(this, "emptyText");
    this.goCreateButton = getField(this, "goCreateButton");

    this.contentState = getField(this, "contentState");
    this.userList = getField(this, "userList");

    this.editCard = getField(this, "editCard");
    this.editHeading = getField(this, "editHeading");
    this.deleteCard = getField(this, "deleteCard");
    this.deleteHeading = getField(this, "deleteHeading");

    this.selectedUserLabel = getField(this, "selectedUserLabel");
    this.newPasswordLabel = getField(this, "newPasswordLabel");
    this.newPasswordInput = getField(this, "newPasswordInput");
    this.saveButton = getField(this, "saveButton");

    this.selectedUserLabel2 = getField(this, "selectedUserLabel2");
    this.deleteButton = getField(this, "deleteButton");

    this.manageCards = this.contentState.querySelector(".split");

    this.buildPlayRow();
    this.buildGamePanel();
    this.applyTranslations();
    this.bindEvents();

    this.unsubscribe = subscribe((currentState) => this.render(currentState));
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  buildPlayRow() {
    this.playRow = createElement("div", "centerActions");
    this.playButton = createElement("button");
    this.playButton.type = "button";
    this.playButton.className = "playPrimaryButton";
    this.playRow.append(this.playButton);
    this.contentState.prepend(this.playRow);
  }

  buildGamePanel() {
    this.gamePanel = createElement("section", "card hidden");
    this.gamePanel.classList.add("gamePanel");

    const gameTop = createElement("div", "gameTopRow");
    this.gameHeading = createElement("h2");
    this.gameHeading.classList.add("gameTitle");
    this.exitGameButton = createElement("button", "tab");
    this.exitGameButton.type = "button";
    gameTop.append(this.gameHeading, this.exitGameButton);

    const split = createElement("div", "split");

    const movesCard = createElement("section", "subcard");
    this.movesHeading = createElement("h3");
    const movesRow = createElement("div", "gameMoveGrid");
    this.rockButton = createElement("button");
    this.rockButton.type = "button";
    this.paperButton = createElement("button");
    this.paperButton.type = "button";
    this.scissorsButton = createElement("button");
    this.scissorsButton.type = "button";
    movesRow.append(this.rockButton, this.paperButton, this.scissorsButton);
    movesCard.append(this.movesHeading, movesRow);

    const latestCard = createElement("section", "subcard");
    this.latestHeading = createElement("h3");
    this.latestBody = createElement("div", "row");
    latestCard.append(this.latestHeading, this.latestBody);

    const statsCard = createElement("section", "subcard");
    this.statsHeading = createElement("h3");
    this.statsBody = createElement("div", "row");
    statsCard.append(this.statsHeading, this.statsBody);

    split.append(movesCard, latestCard, statsCard);
    this.gamePanel.append(gameTop, split);
    this.contentState.append(this.gamePanel);
  }

  applyTranslations() {
    this.playButton.textContent = t("manage.playButton");
    this.exitGameButton.textContent = t("manage.exitGameButton");
    this.emptyText.textContent = t("manage.noUsers");
    this.goCreateButton.textContent = t("manage.goCreateButton");
    this.editHeading.textContent = t("manage.editHeading");
    this.deleteHeading.textContent = t("manage.deleteHeading");
    this.newPasswordLabel.textContent = t("manage.newPasswordLabel");
    this.newPasswordInput.placeholder = t("manage.newPasswordPlaceholder");
    this.saveButton.textContent = t("manage.saveButton");
    this.deleteButton.textContent = t("manage.deleteButton");
    this.userList.setAttribute("aria-label", t("manage.userListLabel"));

    if (this.pageLogoutButton) this.pageLogoutButton.textContent = t("manage.logoutButton");

    this.gameHeading.textContent = t("play.heading");
    this.movesHeading.textContent = t("play.moveHeading");
    this.latestHeading.textContent = t("play.latestHeading");
    this.statsHeading.textContent = t("play.statsHeading");
    this.rockButton.textContent = `${t("play.rock")} ✊`;
    this.paperButton.textContent = `${t("play.paper")} ✋`;
    this.scissorsButton.textContent = `${t("play.scissors")} ✌️`;
  }

  bindEvents() {
    if (this.pageLogoutButton) {
      this.pageLogoutButton.addEventListener("click", async () => {
        state.status = "loading";
        state.error = "";
        notify();

        try {
          await UserService.logoutUser();
        } catch {}

        clearAppSession();
        setView("create");
      });
    }

    this.playButton.addEventListener("click", async () => {
      state.gameMode = true;
      state.latestPlay = null;
      state.playStats = null;
      this.userList.replaceChildren();
      notify();
      await this.loadStats();
    });

    this.exitGameButton.addEventListener("click", () => {
      state.gameMode = false;
      state.latestPlay = null;
      notify();
    });

    this.goCreateButton.addEventListener("click", () => {
      setView("create");
    });

    this.saveButton.addEventListener("click", async () => {
      const username = state.selectedUsername;
      if (!username) return;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        const updatedUser = await UserService.editUser(username, this.newPasswordInput.value);
        this.newPasswordInput.value = "";

        if (state.currentUser && state.currentUser.username === updatedUser.username) {
          state.currentUser = updatedUser;
          saveSession(state.authToken, updatedUser);
        }

        notify();
      } catch (error) {
        state.status = "error";
        state.error = error?.message || t("errors.request_failed");
        notify();
      }
    });

    this.deleteButton.addEventListener("click", async () => {
      const username = state.selectedUsername;
      if (!username) return;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        const removedUser = await UserService.deleteUser(username);
        const deletingCurrentUser = state.currentUser && state.currentUser.username === removedUser.username;

        if (deletingCurrentUser) {
          clearAppSession();
          setView("create");
          return;
        }
      } catch (error) {
        state.status = "error";
        state.error = error?.message || t("errors.request_failed");
        notify();
      }
    });

    this.rockButton.addEventListener("click", async () => this.playMove("rock"));
    this.paperButton.addEventListener("click", async () => this.playMove("paper"));
    this.scissorsButton.addEventListener("click", async () => this.playMove("scissors"));
  }

  async loadStats() {
    state.status = "loading";
    state.error = "";
    notify();

    try {
      state.playStats = await PlayService.getStats();
      state.status = "ready";
      notify();
    } catch (error) {
      state.status = "error";
      state.error = error?.message || t("errors.request_failed");
      notify();
    }
  }

  async playMove(playerMove) {
    state.status = "loading";
    state.error = "";
    notify();

    try {
      state.latestPlay = await PlayService.createPlay(playerMove);
      state.playStats = await PlayService.getStats();
      state.status = "ready";
      notify();
    } catch (error) {
      state.status = "error";
      state.error = error?.message || t("errors.request_failed");
      notify();
    }
  }

  render(currentState) {
    syncNavAvailability(currentState);

    const loading = currentState.status === "loading";
    const hasUsers = currentState.users.length > 0;
    const hasSelection = Boolean(currentState.selectedUsername);
    const canPlay = Boolean(currentState.currentUser) && !currentState.currentUser?.isAdmin;
    const gameMode = Boolean(currentState.gameMode && canPlay);

    if (this.pageLogoutButton) {
      this.pageLogoutButton.disabled = loading || !currentState.currentUser;
      this.pageLogoutButton.classList.toggle("hidden", gameMode || !currentState.currentUser);
    }

    this.playButton.disabled = loading || !canPlay || gameMode;
    this.exitGameButton.disabled = loading;
    this.saveButton.disabled = loading || !hasSelection;
    this.newPasswordInput.disabled = loading || !hasSelection;
    this.deleteButton.disabled = loading || !hasSelection;
    this.rockButton.disabled = loading || !canPlay;
    this.paperButton.disabled = loading || !canPlay;
    this.scissorsButton.disabled = loading || !canPlay;

    this.emptyState.classList.toggle("hidden", hasUsers);
    this.contentState.classList.toggle("hidden", !hasUsers);

    if (!hasUsers) {
      this.userList.replaceChildren();
      this.playRow.classList.add("hidden");
      this.editCard.classList.add("hidden");
      this.deleteCard.classList.add("hidden");
      this.gamePanel.classList.add("hidden");
      return;
    }

    this.playRow.classList.toggle("hidden", gameMode || !canPlay);
    this.userList.classList.toggle("hidden", gameMode);
    this.manageCards.classList.toggle("hidden", gameMode);
    this.gamePanel.classList.toggle("hidden", !gameMode);

    if (gameMode) {
      this.userList.replaceChildren();
    } else {
      this.renderUserList(currentState);
    }

    const showManageCards = hasSelection && !gameMode;
    this.editCard.classList.toggle("hidden", !showManageCards);
    this.deleteCard.classList.toggle("hidden", !showManageCards);

    const selectedText = `${t("manage.selected")}: ${currentState.selectedUsername || t("manage.none")}`;
    this.selectedUserLabel.textContent = selectedText;
    this.selectedUserLabel2.textContent = selectedText;

    if (gameMode) {
      this.renderLatestPlay(currentState.latestPlay);
      this.renderStats(currentState.playStats);
    }
  }

  renderUserList(currentState) {
    const nodes = [];

    for (const user of currentState.users) {
      const item = createElement("button", user.username === currentState.selectedUsername ? "item active" : "item");
      item.type = "button";
      item.setAttribute("aria-pressed", String(user.username === currentState.selectedUsername));

      const left = createElement("div");
      const strong = createElement("strong");
      strong.textContent = user.username;

      const meta = createElement("div", "meta");
      meta.textContent = formatMeta(user);

      left.append(strong, meta);
      item.append(left);

      item.addEventListener("click", () => {
        state.selectedUsername = user.username;
        notify();
      });

      nodes.push(item);
    }

    this.userList.replaceChildren(...nodes);
  }

  renderLatestPlay(latestPlay) {
    if (!latestPlay) {
      this.latestBody.replaceChildren(this.makeTextLine(t("play.emptyLatest")));
      return;
    }

    this.latestBody.replaceChildren(
      this.makeTextLine(`${t("play.playerMove")}: ${this.getMoveLabel(latestPlay.playerMove)}`),
      this.makeTextLine(`${t("play.serverMove")}: ${this.getMoveLabel(latestPlay.serverMove)}`),
      this.makeTextLine(`${t("play.result")}: ${this.getResultLabel(latestPlay.result)}`)
    );
  }

  renderStats(playStats) {
    const stats = playStats || emptyStats();

    if (!playStats) {
      this.statsBody.replaceChildren(this.makeTextLine(t("play.emptyStats")));
      return;
    }

    this.statsBody.replaceChildren(
      this.makeTextLine(`${t("play.played")}: ${stats.totalPlays}`),
      this.makeTextLine(`${t("play.wins")}: ${stats.wins}`),
      this.makeTextLine(`${t("play.losses")}: ${stats.losses}`),
      this.makeTextLine(`${t("play.draws")}: ${stats.draws}`)
    );
  }

  makeTextLine(text) {
    const line = createElement("div", "small");
    line.textContent = text;
    return line;
  }

  getMoveLabel(value) {
    if (value === "rock") return t("play.rock");
    if (value === "paper") return t("play.paper");
    if (value === "scissors") return t("play.scissors");
    return value;
  }

  getResultLabel(value) {
    if (value === "win") return t("play.win");
    if (value === "loss") return t("play.loss");
    if (value === "draw") return t("play.draw");
    return value;
  }
}
