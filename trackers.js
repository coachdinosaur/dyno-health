function handleBpSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const systolic = Number(data.get('systolic'));
  const diastolic = Number(data.get('diastolic'));
  const pulse = data.get('pulse') ? Number(data.get('pulse')) : null;
  const symptoms = getChecked(form, 'bpSymptoms');
  const category = bloodPressureCategory(systolic, diastolic);
  saveEntry({ type: 'bp', datetime: data.get('datetime'), systolic, diastolic, pulse, symptoms, notes: data.get('notes').trim(), category: category.label });

  if (category.level === 'danger' && symptoms.length) {
    showResult($('#bp-result'), `<strong>Emergency warning:</strong> This reading is above 180/120 mm Hg and you selected concerning symptoms. Call local emergency services now. Do not wait for the app to interpret another reading.`, 'danger');
  } else if (category.level === 'danger') {
    showResult($('#bp-result'), `<strong>Severe range:</strong> Wait at least one minute, check again using correct technique, and contact a health professional promptly if it remains above 180/120 mm Hg. If concerning symptoms begin, call emergency services.`, 'danger');
  } else {
    showResult($('#bp-result'), `<strong>${category.label}:</strong> One reading does not diagnose hypertension. Save a pattern and discuss it with your health professional.`, category.level);
  }
  form.reset();
  form.elements.datetime.value = nowLocalInput();
}

function handleGlucoseSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const glucose = Number(data.get('glucose'));
  const flags = getChecked(form, 'glucoseFlags');
  saveEntry({ type: 'glucose', datetime: data.get('datetime'), glucose, context: data.get('context'), flags, notes: data.get('notes').trim() });

  const hasDkaSigns = flags.some(flag => /vomiting|fruity|deep breathing|stomach pain/i.test(flag));
  if (glucose < 55) {
    showResult($('#glucose-result'), `<strong>Severely low glucose:</strong> If the person cannot safely swallow, is unconscious, or has a seizure, do not give food or drink. Use prescribed glucagon if trained and call emergency services.`, 'danger');
  } else if (glucose < 70) {
    showResult($('#glucose-result'), `<strong>Low glucose:</strong> CDC advises the 15-15 rule for most adults: take 15 grams of fast-acting carbohydrate, wait 15 minutes, and recheck. Repeat if still below 70 mg/dL, then eat a balanced snack or meal. Follow your personal plan if it differs.`, 'warning');
  } else if (glucose >= 300 && hasDkaSigns) {
    showResult($('#glucose-result'), `<strong>Possible diabetic ketoacidosis:</strong> Very high glucose with vomiting, fruity breath, deep breathing, or stomach pain can be an emergency. Check ketones if your plan says to, and seek emergency care now.`, 'danger');
  } else if (glucose >= 250 && flags.includes('ill or feverish')) {
    showResult($('#glucose-result'), `<strong>Sick-day warning:</strong> CDC advises people with diabetes who are sick or at 250 mg/dL or above to check glucose frequently and test ketones according to their care plan. Contact your diabetes team.`, 'warning');
  } else {
    showResult($('#glucose-result'), `<strong>Entry saved:</strong> The meaning of this number depends on timing, medicines, diabetes type, pregnancy, and your clinician-set target.`, 'info');
  }
  form.reset();
  form.elements.datetime.value = nowLocalInput();
}

function handleFlareSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  saveEntry({
    type: 'flare', datetime: data.get('datetime'), condition: data.get('condition'), severity: Number(data.get('severity')),
    details: data.get('details').trim(), triggers: data.get('triggers').trim(), response: data.get('response').trim()
  });
  showResult($('#flare-result'), '<strong>Entry saved.</strong> A timeline can help your clinician distinguish patterns from isolated bad days.', 'info');
  form.reset();
  form.elements.datetime.value = nowLocalInput();
  $('#severity-output').value = 5;
}

function entryTitle(entry) {
  if (entry.type === 'bp') return `${entry.systolic}/${entry.diastolic} mm Hg`;
  if (entry.type === 'glucose') return `${entry.glucose} mg/dL`;
  return `${entry.condition} · ${entry.severity}/10`;
}

function entryDescription(entry) {
  if (entry.type === 'bp') return [entry.category, entry.pulse ? `Pulse ${entry.pulse}` : '', entry.symptoms?.length ? `Symptoms: ${entry.symptoms.join(', ')}` : '', entry.notes].filter(Boolean).join(' · ');
  if (entry.type === 'glucose') return [entry.context, entry.flags?.length ? entry.flags.join(', ') : '', entry.notes].filter(Boolean).join(' · ');
  return [entry.details, entry.triggers ? `Possible triggers: ${entry.triggers}` : '', entry.response ? `Helped: ${entry.response}` : ''].filter(Boolean).join(' · ');
}

function renderLog() {
  const filter = $('#log-filter').value;
  const entries = loadEntries().filter(entry => filter === 'all' || entry.type === filter);
  $('#log-list').innerHTML = entries.length ? entries.slice(0, 30).map(entry => `
    <article class="log-item">
      <header><div><strong>${escapeHtml(entryTitle(entry))}</strong><br><time datetime="${escapeHtml(entry.datetime)}">${escapeHtml(formatDate(entry.datetime))}</time></div><button class="delete-entry" type="button" data-delete="${entry.id}" aria-label="Delete entry">×</button></header>
      <p>${escapeHtml(entryDescription(entry))}</p>
    </article>`).join('') : '<p class="log-empty">No entries yet. The browser remains blissfully ignorant.</p>';

  $$('.delete-entry').forEach(button => button.addEventListener('click', () => {
    const entries = loadEntries().filter(entry => entry.id !== button.dataset.delete);
    saveEntries(entries);
    renderLog();
    renderDashboard();
  }));
}

function renderDashboard() {
  const entries = loadEntries();
  $('#entry-count').textContent = String(entries.length);
  const bp = entries.find(entry => entry.type === 'bp');
  const glucose = entries.find(entry => entry.type === 'glucose');
  $('#last-bp').textContent = bp ? `${bp.systolic}/${bp.diastolic}` : 'No entry';
  $('#last-bp-label').textContent = bp ? `${bp.category} · ${formatDate(bp.datetime)}` : 'Add a reading to see its category';
  $('#last-glucose').textContent = glucose ? `${glucose.glucose} mg/dL` : 'No entry';
  $('#last-glucose-label').textContent = glucose ? `${glucose.context} · ${formatDate(glucose.datetime)}` : 'Targets are set with your care team';
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function csvCell(value) {
  const text = Array.isArray(value) ? value.join('; ') : String(value ?? '');
  return `"${text.replaceAll('"', '""')}"`;
}

function exportCsv() {
  const entries = loadEntries();
  if (!entries.length) return alert('There are no entries to export. Humanity has finally produced an empty spreadsheet.');
  const headers = ['type','datetime','systolic','diastolic','pulse','glucose','context','condition','severity','symptoms_or_flags','notes_or_details','triggers','response'];
  const rows = entries.map(entry => [
    entry.type, entry.datetime, entry.systolic, entry.diastolic, entry.pulse, entry.glucose, entry.context, entry.condition, entry.severity,
    entry.symptoms || entry.flags || '', entry.notes || entry.details || '', entry.triggers || '', entry.response || ''
  ].map(csvCell).join(','));
  downloadFile(`dyno-health-${new Date().toISOString().slice(0,10)}.csv`, [headers.join(','), ...rows].join('\n'), 'text/csv;charset=utf-8');
}

function exportJson() {
  const payload = { exportedAt: new Date().toISOString(), entries: loadEntries(), plan: safeParse(localStorage.getItem(STORAGE.plan), {}) };
  downloadFile(`dyno-health-backup-${new Date().toISOString().slice(0,10)}.json`, JSON.stringify(payload, null, 2), 'application/json');
}

function handlePlanSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const plan = {
    conditions: getChecked(form, 'conditions'), clinician: data.get('clinician').trim(), contact: data.get('contact').trim(),
    targets: data.get('targets').trim(), medicines: data.get('medicines').trim(), questions: data.get('questions').trim()
  };
  localStorage.setItem(STORAGE.plan, JSON.stringify(plan));
  $('#plan-status').textContent = 'Plan saved in this browser.';
}

function loadPlan() {
  const plan = safeParse(localStorage.getItem(STORAGE.plan), {});
  const form = $('#plan-form');
  ['clinician','contact','targets','medicines','questions'].forEach(name => { form.elements[name].value = plan[name] || ''; });
  $$('input[name="conditions"]', form).forEach(input => { input.checked = (plan.conditions || []).includes(input.value); });
}

function setupTheme() {
  const saved = localStorage.getItem(STORAGE.theme);
  if (saved) document.documentElement.dataset.theme = saved;
  $('#theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(STORAGE.theme, next);
  });
}

function setupNavigation() {
  $$('.tab').forEach(tab => tab.addEventListener('click', () => setView(tab.dataset.view)));
  $$('[data-go]').forEach(button => button.addEventListener('click', () => setView(button.dataset.go)));
  $$('.tracker-tab').forEach(button => button.addEventListener('click', () => {
    $$('.tracker-tab').forEach(tab => tab.classList.toggle('active', tab === button));
    $$('.tracker-panel').forEach(panel => panel.classList.toggle('active', panel.id === `tracker-${button.dataset.tracker}`));
  }));
}

function init() {
  renderConditionCards();
  renderGuide('arthritis');
  renderSources();
  setupTheme();
  setupNavigation();
  loadPlan();
  renderLog();
  renderDashboard();

  $$('input[type="datetime-local"]').forEach(input => { input.value = nowLocalInput(); });
  $('#severity').addEventListener('input', event => { $('#severity-output').value = event.target.value; });
  $('#bp-form').addEventListener('submit', handleBpSubmit);
  $('#glucose-form').addEventListener('submit', handleGlucoseSubmit);
  $('#flare-form').addEventListener('submit', handleFlareSubmit);
  $('#plan-form').addEventListener('submit', handlePlanSubmit);
  $('#log-filter').addEventListener('change', renderLog);
  $('#export-csv').addEventListener('click', exportCsv);
  $('#export-json').addEventListener('click', exportJson);
  $('#clear-data').addEventListener('click', () => {
    if (confirm('Delete every health entry stored in this browser? This cannot be undone unless you exported a backup.')) {
      localStorage.removeItem(STORAGE.entries);
      renderLog();
      renderDashboard();
    }
  });
  $('#print-summary').addEventListener('click', () => window.print());

  const dialog = $('#red-flags-dialog');
  $('#open-red-flags').addEventListener('click', () => dialog.showModal());
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
