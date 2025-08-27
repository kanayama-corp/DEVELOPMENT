document.addEventListener('DOMContentLoaded', () => {
  const autoCopyToggle = document.getElementById('autoCopy');

  // Load current settings
  chrome.storage.sync.get(['autoCopy'], (result) => {
    autoCopyToggle.checked = result.autoCopy !== false; // default to true
  });

  // Save setting on change
  autoCopyToggle.addEventListener('change', () => {
    chrome.storage.sync.set({ autoCopy: autoCopyToggle.checked });
  });
});
