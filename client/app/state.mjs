export const state = {
  users: [],
  selectedUsername: "",
  status: "idle",
  error: ""
};

const listeners = new Set();

function snapshot() {
  return structuredClone(state);
}

export function notify() {
  const s = snapshot();
  for (const fn of listeners) fn(s);
}

export function subscribe(fn) {
  listeners.add(fn);
  fn(snapshot());
  return () => listeners.delete(fn);
}
