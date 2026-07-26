const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const safeParse = (value, fallback) => { try { return JSON.parse(value) ?? fallback; } catch { return fallback; } };
const loadEntries = () => safeParse(localStorage.getItem(STORAGE.entries), []);
const saveEntries = (entries) => localStorage.setItem(STORAGE.entries, JSON.stringify(entries));
const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
const nowLocalInput = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};
const formatDate = value => new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));
const uid = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function setView(name) {
  $$('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  $$('.tab').forEach(tab => tab.classList.toggle('active', tab.dataset.view === name));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderConditionCards() {
  $('#condition-grid').innerHTML = Object.entries(conditions).map(([key, item]) => `
    <button class="condition-card" type="button" data-condition="${key}">
      <span class="condition-icon" aria-hidden="true">${item.icon}</span>
      <span><strong>${item.name}</strong><p>${item.tagline}</p></span>
    </button>`).join('');

  $('#guide-picker').innerHTML = Object.entries(conditions).map(([key, item], index) => `
    <button class="guide-button ${index === 0 ? 'active' : ''}" type="button" role="tab" aria-selected="${index === 0}" data-guide="${key}">${item.name}</button>`).join('');

  $('#condition-checklist').innerHTML = Object.values(conditions).map(item => `
    <label><input type="checkbox" name="conditions" value="${item.name}"> ${item.name}</label>`).join('');

  $$('.condition-card').forEach(button => button.addEventListener('click', () => {
    setView('learn');
    renderGuide(button.dataset.condition);
  }));
  $$('.guide-button').forEach(button => button.addEventListener('click', () => renderGuide(button.dataset.guide)));
}

function renderGuide(key) {
  const item = conditions[key];
  $$('.guide-button').forEach(button => {
    const active = button.dataset.guide === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
  $('#guide-content').innerHTML = `
    <section class="panel guide-main">
      <p class="eyebrow">${item.icon} ${item.name}</p>
      <h2>${item.tagline}</h2>
      <p>${item.overview}</p>
      <h3>What to track</h3>
      <ul>${item.watch.map(text => `<li>${text}</li>`).join('')}</ul>
      <h3>Practical self-care</h3>
      <ul>${item.actions.map(text => `<li>${text}</li>`).join('')}</ul>
      <div class="callout warning"><strong>Urgent warning:</strong> ${item.urgent}</div>
    </section>
    <aside class="panel guide-side">
      <p class="eyebrow">Prepare for care</p>
      <h3>Discuss with your clinician</h3>
      <ul>${item.discuss.map(text => `<li>${text}</li>`).join('')}</ul>
      <div class="callout"><strong>Keep this app in its lane:</strong> use it to record facts and questions, not to identify a rash, choose a drug, or replace a diagnosis.</div>
      <p class="source-note">See the Sources tab for the medical organizations used in this guide.</p>
    </aside>`;
}

function renderSources() {
  $('#sources-grid').innerHTML = sources.map(source => `
    <article class="panel source-card">
      <p class="eyebrow">${source.group}</p>
      <ul>${source.links.map(([label, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a></li>`).join('')}</ul>
    </article>`).join('');
}

function bloodPressureCategory(sys, dia) {
  if (sys > 180 || dia > 120) return { label: 'Severe range', level: 'danger' };
  if (sys >= 140 || dia >= 90) return { label: 'Stage 2 range', level: 'warning' };
  if (sys >= 130 || dia >= 80) return { label: 'Stage 1 range', level: 'warning' };
  if (sys >= 120 && dia < 80) return { label: 'Elevated range', level: 'info' };
  return { label: 'Normal AHA category', level: 'info' };
}

function showResult(element, html, level = 'info') {
  element.hidden = false;
  element.className = `result-box ${level === 'info' ? '' : level}`;
  element.innerHTML = html;
}

function saveEntry(entry) {
  const entries = loadEntries();
  entries.unshift({ id: uid(), ...entry });
  saveEntries(entries);
  renderLog();
  renderDashboard();
}

function getChecked(form, name) {
  return $$(`input[name="${name}"]:checked`, form).map(input => input.value);
}
