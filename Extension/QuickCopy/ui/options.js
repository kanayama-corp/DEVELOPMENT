document.addEventListener('DOMContentLoaded', () => {
  const autoCopy = document.getElementById('autoCopy');
  const eventDrag = document.getElementById('eventDrag');
  const eventDblclick = document.getElementById('eventDblclick');
  const eventTripleclick = document.getElementById('eventTripleclick');
  const trimWhitespace = document.getElementById('trimWhitespace');
  const collapseWhitespace = document.getElementById('collapseWhitespace');
  const newlineToSpace = document.getElementById('newlineToSpace');
  const decodeUrls = document.getElementById('decodeUrls');
  const minLength = document.getElementById('minLength');
  const excludeInputs = document.getElementById('excludeInputs');
  const deduplication = document.getElementById('deduplication');
  const blockedDomains = document.getElementById('blockedDomains');
  const saveButton = document.getElementById('save');
  const status = document.getElementById('status');
  
  function saveOptions() {
    const settings = {
      autoCopy: autoCopy.checked,
      events: {
        drag: eventDrag.checked,
        dblclick: eventDblclick.checked,
        tripleclick: eventTripleclick.checked
      },
      trimWhitespace: trimWhitespace.checked,
      collapseWhitespace: collapseWhitespace.checked,
      newlineToSpace: newlineToSpace.checked,
      decodeUrls: decodeUrls.checked,
      minLength: parseInt(minLength.value, 10) || 1,
      excludeInputs: excludeInputs.checked,
      deduplication: deduplication.checked,
      blockedDomains: blockedDomains.value.split('\n').map(d => d.trim()).filter(Boolean),
    };

    chrome.storage.sync.set(settings, () => {
      status.textContent = '設定を保存しました！';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  }

  function restoreOptions() {
    chrome.storage.sync.get(null, (items) => {
      autoCopy.checked = items.autoCopy !== false;
      eventDrag.checked = items.events?.drag !== false;
      eventDblclick.checked = items.events?.dblclick !== false;
      eventTripleclick.checked = items.events?.tripleclick !== false;
      trimWhitespace.checked = items.trimWhitespace !== false;
      collapseWhitespace.checked = items.collapseWhitespace === true;
      newlineToSpace.checked = items.newlineToSpace === true;
      decodeUrls.checked = items.decodeUrls === true;
      minLength.value = items.minLength || 1;
      excludeInputs.checked = items.excludeInputs !== false;
      deduplication.checked = items.deduplication !== false;
      blockedDomains.value = (items.blockedDomains || []).join('\n');
    });
  }

  saveButton.addEventListener('click', saveOptions);
  restoreOptions();
});
