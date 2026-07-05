"use strict";

const tabsEl = document.getElementById("tabs");
const listEl = document.getElementById("list");
const searchEl = document.getElementById("search");
const countEl = document.getElementById("count");

let active = 0;     // index into PAYLOADS
let query = "";

function esc(s) {
  return s.replace(/[&<>"']/g, c => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// highlight query matches in already-escaped text
function highlight(escaped, q) {
  if (!q) return escaped;
  const eq = esc(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(eq, "gi"), m => `<mark>${m}</mark>`);
}

function copy(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    btn.textContent = "✓";
    btn.classList.add("done");
    setTimeout(() => { btn.textContent = "copy"; btn.classList.remove("done"); }, 900);
  });
}

function matchingItems() {
  const q = query.toLowerCase();
  const out = [];
  PAYLOADS.forEach((cat, ci) => {
    cat.items.forEach(it => {
      const hit = !q ||
        it.payload.toLowerCase().includes(q) ||
        (it.note && it.note.toLowerCase().includes(q)) ||
        cat.name.toLowerCase().includes(q);
      if (hit) out.push({ cat, ci, it });
    });
  });
  return out;
}

function render() {
  tabsEl.querySelectorAll(".tab").forEach((t, i) => {
    t.classList.toggle("active", !query && i === active);
  });

  let rows;
  let header = "";

  if (query) {
    rows = matchingItems();
    header = `<div class="cat-desc">Search results</div>`;
  } else {
    const cat = PAYLOADS[active];
    header = `<div class="cat-desc">${esc(cat.desc)}</div>`;
    rows = cat.items.map(it => ({ cat, it }));
  }

  countEl.textContent = `${rows.length} payload${rows.length === 1 ? "" : "s"}`;

  if (!rows.length) {
    listEl.innerHTML = header + `<div class="empty">No payloads match “${esc(query)}”</div>`;
    return;
  }

  listEl.innerHTML = header + rows.map(({ cat, it }, i) => {
    const label = query ? `<span class="note">${esc(cat.name)}</span> · ` : "";
    return `<div class="item" data-i="${i}">
      <div class="item-body">
        <div class="payload">${highlight(esc(it.payload), query)}</div>
        <div class="note">${label}${highlight(esc(it.note || ""), query)}</div>
      </div>
      <button class="copy">copy</button>
    </div>`;
  }).join("");

  // wire copy buttons against the rendered row set
  listEl.querySelectorAll(".item").forEach((row, i) => {
    row.querySelector(".copy").addEventListener("click", () => copy(rows[i].it.payload, row.querySelector(".copy")));
  });
}

// build tabs
PAYLOADS.forEach((cat, i) => {
  const b = document.createElement("div");
  b.className = "tab";
  b.textContent = cat.name;
  b.addEventListener("click", () => { active = i; searchEl.value = ""; query = ""; render(); });
  tabsEl.appendChild(b);
});

searchEl.addEventListener("input", e => { query = e.target.value.trim(); render(); });

render();
