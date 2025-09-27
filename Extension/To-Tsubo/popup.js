document.addEventListener('DOMContentLoaded', function() {
  const sqmInput = document.getElementById('sqm-input');
  const tsuboResult = document.getElementById('tsubo-result');
  const copyBtn = document.getElementById('copy-btn');
  const settingsBtn = document.getElementById('settings-btn');
  let savedCopyShortcut = null;

  function convertToTsubo(sqm) {
    return sqm / 3.30579;
  }

  function updateResult() {
    const sqm = parseFloat(sqmInput.value);

    if (isNaN(sqm) || sqm < 0) {
      tsuboResult.textContent = '-';
      copyBtn.style.display = 'none';
      return;
    }

    const tsubo = convertToTsubo(sqm);
    tsuboResult.textContent = tsubo.toFixed(2);
    copyBtn.style.display = 'inline-block';
  }

  function copyToClipboard() {
    const result = tsuboResult.textContent;
    if (result !== '-') {
      navigator.clipboard.writeText(result).then(() => {
        copyBtn.textContent = '✓';
        setTimeout(() => {
          copyBtn.textContent = '📋';
        }, 1000);
        sqmInput.value = '';
        updateResult();
        sqmInput.focus();
      });
    }
  }

  function copyToClipboardWithoutClear() {
    const result = tsuboResult.textContent;
    if (result !== '-') {
      navigator.clipboard.writeText(result).then(() => {
        copyBtn.textContent = '✓';
        setTimeout(() => {
          copyBtn.textContent = '📋';
        }, 1000);
      });
    }
  }

  function openSettings() {
    chrome.runtime.openOptionsPage();
  }

  function normalizeKey(key) {
    if (!key) return key;
    const specialMap = {
      ' ': 'Space',
      'Escape': 'Esc',
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight'
    };
    if (key.length === 1) return key.toUpperCase();
    return specialMap[key] || key;
  }

  function isShortcutMatch(e, sc) {
    if (!sc) return false;
    return (
      !!e.ctrlKey === !!sc.ctrlKey &&
      !!e.metaKey === !!sc.metaKey &&
      !!e.altKey === !!sc.altKey &&
      !!e.shiftKey === !!sc.shiftKey &&
      normalizeKey(e.key) === sc.key
    );
  }

  sqmInput.addEventListener('input', updateResult);
  copyBtn.addEventListener('click', copyToClipboard);
  settingsBtn.addEventListener('click', openSettings);

  // Handle keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // 1) Custom user-configured shortcut
    if (savedCopyShortcut && isShortcutMatch(event, savedCopyShortcut)) {
      if (tsuboResult.textContent !== '-') {
        event.preventDefault();
        copyToClipboardWithoutClear();
        return;
      }
    }
    // 2) Fallback: Ctrl/Cmd + C within the popup
    if ((event.ctrlKey || event.metaKey) && normalizeKey(event.key) === 'C') {
      if (tsuboResult.textContent !== '-') {
        event.preventDefault();
        copyToClipboardWithoutClear();
      }
    }
  });

  // Ensure input field is always focused when popup opens
  setTimeout(() => {
    sqmInput.focus();
    sqmInput.select();
  }, 100);

  // Load saved shortcut
  chrome.storage && chrome.storage.sync && chrome.storage.sync.get(['copyShortcut'], (res) => {
    if (res && res.copyShortcut) {
      // Ensure key is normalized as stored by options page
      savedCopyShortcut = res.copyShortcut;
    }
  });
});