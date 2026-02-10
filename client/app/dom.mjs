export function getTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl || !(tpl instanceof HTMLTemplateElement)) throw new Error(`Missing template: ${id}`);
  return tpl;
}

export function getField(root, name) {
  const el = root.querySelector(`[data-field="${name}"]`);
  if (!el) throw new Error(`Missing field: ${name}`);
  return el;
}

export function createElement(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

export function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

export function formatMeta(user) {
  const parts = [];
  const created = formatDateTime(user.createdAt);
  if (created) parts.push(`Created: ${created}`);
  const tos = formatDateTime(user.tosAcceptedAt);
  if (tos) parts.push(`Terms accepted: ${tos}`);
  return parts.join(" • ");
}
