/* Aldanese Archives — static/app.js
   Enhances forms, adds search/filter, confirms sensitive actions,
   and provides small UX niceties. All server logic remains in Flask.
*/

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Toast messages
  function toast(msg, type = "info") {
    const bar = document.createElement("div");
    bar.className = `flash ${type}`;
    bar.textContent = msg;
    document.body.appendChild(bar);
    setTimeout(() => bar.remove(), 3000);
  }

  // Confirm before promote/demote/medal
  function bindConfirmations() {
    ["promote", "demote", "medal"].forEach(action => {
      const form = $(`form[action$="/${action}"]`);
      if (form) {
        form.addEventListener("submit", e => {
          const targetId = $('input[name="id"]', form)?.value || "";
          const sel = $('select', form);
          const val = sel?.value || "";
          if (!val) {
            e.preventDefault();
            toast(`Choose a value before ${action}.`, "error");
            return;
          }
          const ok = confirm(`Confirm ${action} ${targetId} → ${val}?`);
          if (!ok) e.preventDefault();
        });
      }
    });
  }

  // Roster filter
  function bindRosterFilter() {
    const rosterSection = $("section.section h3 + ul");
    if (!rosterSection) return;
    const filterWrap = document.createElement("div");
    filterWrap.style.margin = "0.5rem 0 1rem";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Filter roster by name, username, or rank...";
    input.style.padding = "0.5rem";
    input.style.width = "100%";
    filterWrap.appendChild(input);
    rosterSection.parentElement.insertBefore(filterWrap, rosterSection);

    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase();
      $$("li", rosterSection).forEach(li => {
        const txt = li.textContent.toLowerCase();
        li.style.display = txt.includes(q) ? "" : "none";
      });
    });
  }

  // Add form validation
  function bindAddForm() {
    const addForm = $('form[action$="/add"]');
    if (!addForm) return;
    addForm.addEventListener("submit", e => {
      const name = $('input[name="name"]', addForm)?.value.trim();
      const rank = $('select[name="rank"]', addForm)?.value.trim();
      if (!name || !rank) {
        e.preventDefault();
        toast("Please provide both name and rank.", "error");
      }
    });
  }

  // Login form validation
  function bindLoginForm() {
    const loginForm = $('form[action$="/login"]');
    if (!loginForm) return;
    loginForm.addEventListener("submit", e => {
      const u = $('input[name="username"]', loginForm)?.value.trim();
      const p = $('input[name="password"]', loginForm)?.value;
      if (!u || !p) {
        e.preventDefault();
        toast("Enter username and password.", "error");
      }
    });
  }

  // Keyboard shortcut: Ctrl+Enter submits current form
  function bindKeyboardShortcuts() {
    document.addEventListener("keydown", e => {
      if (e.ctrlKey && e.key === "Enter") {
        const active = document.activeElement;
        const form = active ? active.closest("form") : null;
        if (form) form.requestSubmit ? form.requestSubmit() : form.submit();
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindConfirmations();
    bindRosterFilter();
    bindAddForm();
    bindLoginForm();
    bindKeyboardShortcuts();
  });
})();
