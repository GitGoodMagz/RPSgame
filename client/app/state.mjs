export const state = {
  users: [],
  currentUser: null,
  authToken: "",
  selectedUsername: "",
  status: "idle",
  error: "",
  view: "create",
  gameMode: false,
  latestPlay: null,
  playStats: null
};

const listeners = new Set();

function snapshot() {
  return structuredClone(state);
}

export function notify() {
  const nextState = snapshot();
  for (const listener of listeners) listener(nextState);
}

export function subscribe(listener) {
  listeners.add(listener);
  listener(snapshot());
  return () => listeners.delete(listener);
}
