(() => {
  "use strict";

  const state = {
    collections: [],
    activeCollection: null,
    entries: [],
    editing: null, // { slug, data, body, isNew }
    initialSnapshot: null,
  };

  const el = (id) => document.getElementById(id);

  // ---------- Toasts ----------

  function toast(message, type = "info") {
    const root = el("toast-root");
    const node = document.createElement("div");
    node.className = `toast ${type}`;
    node.textContent = message;
    root.appendChild(node);
    setTimeout(() => node.remove(), 4200);
  }

  // ---------- API ----------

  async function api(path, options = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Fehler bei ${path}`);
    }
    return data;
  }

  // ---------- Setup ----------

  async function checkStatus() {
    const status = await api("/api/status");
    if (status.configured) {
      el("setup-screen").classList.add("hidden");
      el("app").classList.remove("hidden");
      el("branch-badge").textContent = `Branch: ${status.branch}`;

      const liveLink = el("live-site-link");
      if (status.liveSiteUrl) {
        liveLink.href = status.liveSiteUrl;
        liveLink.classList.remove("hidden");
      } else {
        liveLink.classList.add("hidden");
      }

      await loadCollections();
    } else {
      el("setup-screen").classList.remove("hidden");
      el("app").classList.add("hidden");
    }
  }

  el("disconnect-btn").addEventListener("click", async () => {
    if (!confirm("Verbindung zu GitHub wirklich trennen? Du musst dich danach neu einrichten.")) return;
    try {
      await api("/api/disconnect", { method: "POST" });
      toast("Verbindung getrennt.", "success");
      await checkStatus();
    } catch (err) {
      toast(err.message, "error");
    }
  });

  el("setup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = el("setup-submit");
    const errorEl = el("setup-error");
    errorEl.classList.add("hidden");
    submitBtn.disabled = true;
    submitBtn.textContent = "Verbinde …";

    try {
      await api("/api/setup", {
        method: "POST",
        body: JSON.stringify({
          token: el("setup-token").value.trim(),
          owner: el("setup-owner").value.trim(),
          repo: el("setup-repo").value.trim(),
          branch: el("setup-branch").value.trim(),
        }),
      });
      toast("Verbunden! Viel Spaß beim Bearbeiten.", "success");
      await checkStatus();
    } catch (err) {
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Verbinden";
    }
  });

  // ---------- Collections & Entries ----------

  async function loadCollections() {
    state.collections = await api("/api/collections");
    renderNav();
    if (state.collections.length) {
      selectCollection(state.collections[0].name);
    }
  }

  function renderNav() {
    const nav = el("collection-nav");
    nav.innerHTML = "";
    state.collections.forEach((c) => {
      const btn = document.createElement("button");
      btn.textContent = c.label;
      btn.dataset.name = c.name;
      btn.className = c.name === state.activeCollection?.name ? "active" : "";
      btn.addEventListener("click", () => selectCollection(c.name));
      nav.appendChild(btn);
    });
  }

  async function selectCollection(name) {
    state.activeCollection = state.collections.find((c) => c.name === name);
    renderNav();
    el("main-title").textContent = state.activeCollection.label;
    const searchInput = el("entry-search");
    searchInput.value = "";
    searchInput.classList.add("hidden");
    el("entry-list").innerHTML = '<p class="muted">Lade …</p>';
    try {
      state.entries = await api(`/api/content/${name}`);
      if (state.entries.length > 6) searchInput.classList.remove("hidden");
      renderEntryList();
    } catch (err) {
      el("entry-list").innerHTML =
        '<div class="empty-state">Laden fehlgeschlagen. Prüfe deine Internetverbindung und versuche es erneut.</div>';
      toast(err.message, "error");
    }
  }

  el("entry-search").addEventListener("input", () => renderEntryList());

  function titleFieldName() {
    const f = state.activeCollection.fields.find((f) => f.isTitle);
    return f ? f.name : "title";
  }

  function getFilteredEntries() {
    const query = el("entry-search").value.trim().toLowerCase();
    if (!query) return state.entries;
    const titleField = titleFieldName();
    return state.entries.filter((entry) =>
      String(entry.data[titleField] || entry.slug).toLowerCase().includes(query)
    );
  }

  function renderEntryList() {
    const list = el("entry-list");
    list.innerHTML = "";
    if (!state.entries.length) {
      list.innerHTML = '<div class="empty-state">Noch keine Einträge. Klicke oben rechts auf „Neuer Eintrag".</div>';
      return;
    }
    const filtered = getFilteredEntries();
    if (!filtered.length) {
      list.innerHTML = '<div class="empty-state">Keine Einträge gefunden.</div>';
      return;
    }
    const titleField = titleFieldName();
    const imageField = state.activeCollection.fields.find((f) => f.type === "image");

    filtered.forEach((entry) => {
      const card = document.createElement("div");
      card.className = "entry-card";

      const thumb = document.createElement("div");
      thumb.className = "entry-thumb";
      const imgPath = imageField ? entry.data[imageField.name] : null;
      if (imgPath) thumb.style.backgroundImage = `url("${imgPath}")`;
      card.appendChild(thumb);

      const info = document.createElement("div");
      info.className = "entry-info";
      const title = document.createElement("p");
      title.className = "entry-title";
      title.textContent = entry.data[titleField] || entry.slug;
      const sub = document.createElement("p");
      sub.className = "entry-sub";
      sub.textContent = entry.slug;
      info.appendChild(title);
      info.appendChild(sub);
      card.appendChild(info);

      card.addEventListener("click", () => openEditor(entry, false));
      list.appendChild(card);
    });
  }

  el("add-entry-btn").addEventListener("click", () => {
    if (!state.activeCollection) return;
    openEditor({ slug: "", data: {}, body: "" }, true);
  });

  // ---------- Editor ----------

  function openEditor(entry, isNew) {
    state.editing = { ...entry, isNew };
    el("editor-title").textContent = isNew
      ? `Neuer Eintrag – ${state.activeCollection.label}`
      : `Bearbeiten – ${state.activeCollection.label}`;
    el("editor-delete").classList.toggle("hidden", isNew);
    el("editor-status").textContent = "";
    el("editor-status").className = "editor-status";
    renderFields();
    state.initialSnapshot = JSON.stringify(collectFormData());
    el("editor-overlay").classList.remove("hidden");
  }

  function hasUnsavedChanges() {
    if (!state.editing) return false;
    return JSON.stringify(collectFormData()) !== state.initialSnapshot;
  }

  function closeEditor(force) {
    if (!force && hasUnsavedChanges()) {
      if (!confirm("Du hast ungespeicherte Änderungen. Wirklich schließen und verwerfen?")) return;
    }
    el("editor-overlay").classList.add("hidden");
    state.editing = null;
    state.initialSnapshot = null;
  }

  el("editor-close").addEventListener("click", () => closeEditor(false));
  el("editor-cancel").addEventListener("click", () => closeEditor(false));
  el("editor-overlay").addEventListener("click", (e) => {
    if (e.target === el("editor-overlay")) closeEditor(false);
  });

  window.addEventListener("beforeunload", (e) => {
    if (hasUnsavedChanges()) {
      e.preventDefault();
      e.returnValue = "";
    }
  });

  function renderFields() {
    const container = el("editor-fields");
    container.innerHTML = "";
    const { data, body } = state.editing;

    state.activeCollection.fields.forEach((field) => {
      if (field.isBody) return; // rendered separately below as markdown body
      container.appendChild(renderField(field, data[field.name]));
    });

    const bodyField = state.activeCollection.fields.find((f) => f.isBody);
    if (bodyField) {
      container.appendChild(renderMarkdownField(bodyField.label || "Inhalt", body, "__body__"));
    }
  }

  function fieldWrapper(label, inner) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const l = document.createElement("label");
    l.textContent = label;
    wrap.appendChild(l);
    wrap.appendChild(inner);
    return wrap;
  }

  function renderField(field, value) {
    switch (field.type) {
      case "boolean":
        return renderBooleanField(field, value);
      case "select":
        return renderSelectField(field, value);
      case "image":
        return renderImageField(field, value);
      case "number":
        return renderInputField(field, value, "number");
      case "datetime":
        return renderDatetimeField(field, value);
      case "list":
        return renderListField(field, value);
      case "markdown":
        return renderMarkdownField(field.label, value, field.name);
      default:
        return renderInputField(field, value, "text");
    }
  }

  function renderInputField(field, value, type, placeholder) {
    const input = document.createElement("input");
    input.type = type;
    input.id = `f_${field.name}`;
    input.value = value ?? "";
    if (placeholder) input.placeholder = placeholder;
    if (field.required) input.required = true;
    return fieldWrapper(field.label + (field.required ? " *" : ""), input);
  }

  function isoToLocalInput(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  function localInputToIso(localValue) {
    if (!localValue) return undefined;
    const d = new Date(localValue);
    if (Number.isNaN(d.getTime())) return undefined;
    return d.toISOString();
  }

  function renderDatetimeField(field, value) {
    const input = document.createElement("input");
    input.type = "datetime-local";
    input.id = `f_${field.name}`;
    input.dataset.datetime = "true";
    input.value = isoToLocalInput(value);
    if (field.required) input.required = true;
    return fieldWrapper(field.label + (field.required ? " *" : ""), input);
  }

  function renderBooleanField(field, value) {
    const wrap = document.createElement("div");
    wrap.className = "field field-checkbox";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `f_${field.name}`;
    input.checked = Boolean(value);
    const label = document.createElement("label");
    label.textContent = field.label;
    label.setAttribute("for", input.id);
    wrap.appendChild(input);
    wrap.appendChild(label);
    return wrap;
  }

  function renderSelectField(field, value) {
    const select = document.createElement("select");
    select.id = `f_${field.name}`;
    (field.options || []).forEach((opt) => {
      const option = document.createElement("option");
      option.value = opt;
      option.textContent = opt;
      if (opt === value) option.selected = true;
      select.appendChild(option);
    });
    return fieldWrapper(field.label + (field.required ? " *" : ""), select);
  }

  function renderImageField(field, value) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const label = document.createElement("label");
    label.textContent = field.label + (field.required ? " *" : "");
    wrap.appendChild(label);

    const preview = document.createElement("img");
    preview.className = "field-image-preview";
    if (value) {
      preview.src = value;
      preview.style.display = "block";
    }
    wrap.appendChild(preview);

    const row = document.createElement("div");
    row.className = "field-image-row";

    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = `f_${field.name}`;
    textInput.value = value ?? "";
    textInput.placeholder = "/uploads/dein-bild.jpg";
    textInput.addEventListener("input", () => {
      preview.src = textInput.value;
      preview.style.display = textInput.value ? "block" : "none";
    });

    const uploadBtn = document.createElement("button");
    uploadBtn.type = "button";
    uploadBtn.className = "btn btn-ghost";
    uploadBtn.textContent = "Hochladen";

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    uploadBtn.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files[0];
      if (!file) return;
      uploadBtn.disabled = true;
      uploadBtn.textContent = "Lädt hoch …";
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Upload fehlgeschlagen");
        textInput.value = data.path;
        preview.src = data.path;
        preview.style.display = "block";
        toast("Bild hochgeladen.", "success");
      } catch (err) {
        toast(err.message, "error");
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = "Hochladen";
      }
    });

    row.appendChild(textInput);
    row.appendChild(uploadBtn);
    wrap.appendChild(row);
    wrap.appendChild(fileInput);
    return wrap;
  }

  function renderListField(field, value) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const label = document.createElement("label");
    label.textContent = field.label;
    wrap.appendChild(label);

    const listBox = document.createElement("div");
    listBox.className = "list-field";
    listBox.id = `f_${field.name}`;

    const rows = Array.isArray(value) && value.length ? value : [{}];
    rows.forEach((row) => addListRow(listBox, field, row));

    const addBtn = document.createElement("button");
    addBtn.type = "button";
    addBtn.className = "btn btn-ghost";
    addBtn.textContent = "+ Zeile hinzufügen";
    addBtn.addEventListener("click", () => addListRow(listBox, field, {}));

    wrap.appendChild(listBox);
    wrap.appendChild(addBtn);
    return wrap;
  }

  function addListRow(container, field, rowValue) {
    const row = document.createElement("div");
    row.className = "list-row";
    field.fields.forEach((sub) => {
      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = sub.label;
      input.dataset.subfield = sub.name;
      input.value = rowValue[sub.name] ?? "";
      row.appendChild(input);
    });
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "btn btn-ghost";
    removeBtn.textContent = "✕";
    removeBtn.addEventListener("click", () => row.remove());
    row.appendChild(removeBtn);
    container.appendChild(row);
  }

  function renderMarkdownField(label, value, key) {
    const wrap = document.createElement("div");
    wrap.className = "field";
    const l = document.createElement("label");
    l.textContent = label;
    wrap.appendChild(l);

    const textarea = document.createElement("textarea");
    textarea.id = `f_${key}`;
    textarea.value = value ?? "";
    textarea.rows = 8;

    const toolbar = document.createElement("div");
    toolbar.className = "md-toolbar";
    const actions = [
      ["Fett", "**", "**"],
      ["Kursiv", "_", "_"],
      ["Link", "[", "](https://)"],
      ["Liste", "\n- ", ""],
    ];
    actions.forEach(([label, before, after]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.addEventListener("click", () => wrapSelection(textarea, before, after));
      toolbar.appendChild(btn);
    });

    wrap.appendChild(toolbar);
    wrap.appendChild(textarea);
    return wrap;
  }

  function wrapSelection(textarea, before, after) {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const value = textarea.value;
    const selected = value.slice(start, end);
    textarea.value = value.slice(0, start) + before + selected + after + value.slice(end);
    textarea.focus();
    textarea.selectionStart = start + before.length;
    textarea.selectionEnd = start + before.length + selected.length;
  }

  function collectFormData() {
    const data = {};
    state.activeCollection.fields.forEach((field) => {
      if (field.isBody) return;
      if (field.type === "boolean") {
        data[field.name] = el(`f_${field.name}`)?.checked || false;
      } else if (field.type === "datetime") {
        data[field.name] = localInputToIso(el(`f_${field.name}`)?.value);
      } else if (field.type === "number") {
        const raw = el(`f_${field.name}`)?.value;
        data[field.name] = raw === "" || raw === undefined ? undefined : Number(raw);
      } else if (field.type === "list") {
        const container = el(`f_${field.name}`);
        const rows = Array.from(container.querySelectorAll(".list-row"))
          .map((row) => {
            const entry = {};
            row.querySelectorAll("input[data-subfield]").forEach((input) => {
              entry[input.dataset.subfield] = input.value;
            });
            return entry;
          })
          .filter((entry) => Object.values(entry).some((v) => v && v.trim && v.trim()));
        data[field.name] = rows;
      } else {
        const val = el(`f_${field.name}`)?.value;
        if (val !== "" && val !== undefined) data[field.name] = val;
      }
    });

    const bodyField = state.activeCollection.fields.find((f) => f.isBody);
    const body = bodyField ? el("f___body__")?.value ?? "" : "";

    return { data, body };
  }

  el("editor-save").addEventListener("click", async () => {
    const saveBtn = el("editor-save");
    const statusEl = el("editor-status");
    const { data, body } = collectFormData();

    const titleField = titleFieldName();
    if (state.activeCollection.fields.find((f) => f.name === titleField)?.required && !data[titleField]) {
      statusEl.textContent = "Bitte fülle die Pflichtfelder (*) aus.";
      statusEl.className = "editor-status error";
      return;
    }

    saveBtn.disabled = true;
    statusEl.className = "editor-status";
    statusEl.textContent = "Speichere und veröffentliche auf GitHub …";

    try {
      if (state.editing.isNew) {
        await api(`/api/content/${state.activeCollection.name}`, {
          method: "POST",
          body: JSON.stringify({ data, body, slug: data[titleField] }),
        });
      } else {
        await api(`/api/content/${state.activeCollection.name}/${state.editing.slug}`, {
          method: "PUT",
          body: JSON.stringify({ data, body }),
        });
      }
      statusEl.textContent = "Veröffentlicht ✓";
      statusEl.className = "editor-status success";
      toast("Gespeichert und auf GitHub veröffentlicht.", "success");
      await selectCollection(state.activeCollection.name);
      setTimeout(() => closeEditor(true), 500);
    } catch (err) {
      statusEl.textContent = err.message;
      statusEl.className = "editor-status error";
    } finally {
      saveBtn.disabled = false;
    }
  });

  el("editor-delete").addEventListener("click", async () => {
    if (!state.editing || state.editing.isNew) return;
    if (!confirm("Diesen Eintrag wirklich löschen? Das kann nicht rückgängig gemacht werden.")) return;

    try {
      await api(`/api/content/${state.activeCollection.name}/${state.editing.slug}`, { method: "DELETE" });
      toast("Eintrag gelöscht.", "success");
      closeEditor(true);
      await selectCollection(state.activeCollection.name);
    } catch (err) {
      toast(err.message, "error");
    }
  });

  checkStatus().catch((err) => {
    toast("Server nicht erreichbar: " + err.message, "error");
    el("setup-screen").classList.remove("hidden");
  });
})();
