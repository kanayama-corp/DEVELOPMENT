document.addEventListener('DOMContentLoaded', function() {
  const sqmInput = document.getElementById('sqm-input');
  const tsuboResult = document.getElementById('tsubo-result');
  const copyBtn = document.getElementById('copy-btn');
  const settingsBtn = document.getElementById('settings-btn');

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

  sqmInput.addEventListener('input', updateResult);
  copyBtn.addEventListener('click', copyToClipboard);
  settingsBtn.addEventListener('click', openSettings);

  // Handle keyboard shortcuts
  document.addEventListener('keydown', function(event) {
    // Ctrl+C (or Cmd+C on Mac) for copying
    if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
      // Only copy if there's a valid result to copy
      if (tsuboResult.textContent !== '-') {
        event.preventDefault(); // Prevent default copy behavior
        copyToClipboardWithoutClear();
      }
    }
  });

  // Ensure input field is always focused when popup opens
  setTimeout(() => {
    sqmInput.focus();
    sqmInput.select();
  }, 100);
});