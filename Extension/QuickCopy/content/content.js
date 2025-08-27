let settings = {};
let lastCopiedText = '';

// --- Paste Hotkey Variables ---
let pressedKeys = new Set();

// --- Utility Functions ---

function isGoogleSheets() {
  return window.location.hostname === 'docs.google.com' && window.location.pathname.includes('/spreadsheets/');
}

function isEditable(element) {
  if (!element) return false;
  // On standard pages, we exclude inputs. On Sheets, this logic is handled differently.
  return !isGoogleSheets() && (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable);
}

function formatText(text, formatSettings) {
  let formatted = text;
  if (formatSettings.trimWhitespace) formatted = formatted.trim();
  if (formatSettings.collapseWhitespace) formatted = formatted.replace(/\s{2,}/g, ' ');
  if (formatSettings.newlineToSpace) formatted = formatted.replace(/\r?\n/g, ' ');
  if (formatSettings.decodeUrls) {
    try {
      const decoded = decodeURIComponent(formatted);
      if (decoded !== formatted) formatted = decoded;
    } catch (e) { /* Ignore */ }
  }
  return formatted;
}

async function copyToClipboard(text) {
  try {
    // Modern Clipboard API (preferred)
    await navigator.clipboard.writeText(text);
    console.log('QuickCopy: Text copied successfully via Clipboard API');
    return true;
  } catch (err) {
    console.warn('QuickCopy: Clipboard API failed, trying fallback method:', err.message);
    
    // Fallback to execCommand method
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        console.log('QuickCopy: Text copied successfully via execCommand fallback');
        return true;
      } else {
        console.error('QuickCopy: execCommand copy failed');
        return false;
      }
    } catch (fallbackErr) {
      console.error('QuickCopy: Both Clipboard API and execCommand failed:', fallbackErr);
      return false;
    }
  }
}

// --- Core Logic ---

async function getSelectionFromClipboard() {
    const originalClipboard = await navigator.clipboard.readText().catch(() => '');

    document.execCommand('copy');
    await new Promise(resolve => setTimeout(resolve, 50)); // Wait for clipboard to update

    const newClipboard = await navigator.clipboard.readText().catch(() => '');

    // Restore original clipboard if it was changed
    if (newClipboard !== originalClipboard) {
        await navigator.clipboard.writeText(originalClipboard).catch(() => {});
    }

    return newClipboard;
}

async function handleSelection(event) {
  console.log('QuickCopy: handleSelection triggered', {
    type: event.type,
    detail: event.detail,
    autoCopy: settings.autoCopy,
    dragEnabled: settings.events?.drag,
    dblclickEnabled: settings.events?.dblclick,
    tripleclickEnabled: settings.events?.tripleclick
  });
  
  if (!settings.autoCopy) return;

  const currentDomain = window.location.hostname;
  if (settings.domainMode === 'blocklist' && settings.blockedDomains.includes(currentDomain)) return;

  // Check if the specific event that triggered this is enabled
  switch (event.type) {
    case 'mouseup':
      // This handles drag-selections. Check if drag is enabled and there's a selection
      if (!settings.events.drag) {
        console.log('QuickCopy: Mouseup ignored - drag disabled');
        return;
      }
      // Check if there's actually a text selection (drag selection)
      const selection = window.getSelection();
      if (!selection || selection.toString().trim() === '') {
        console.log('QuickCopy: Mouseup ignored - no text selection found');
        return;
      }
      console.log('QuickCopy: Processing drag selection');
      break;
    case 'dblclick':
      if (!settings.events.dblclick) return;
      console.log('QuickCopy: Processing double-click selection');
      break;
    case 'click':
      // A triple-click fires a 'click' event with detail === 3.
      if (event.detail === 3 && !settings.events.tripleclick) return;
      // Ignore single clicks and the click that's part of a dblclick.
      if (event.detail < 3) return; 
      console.log('QuickCopy: Processing triple-click selection');
      break;
    default:
      return; // Should not happen
  }

  await new Promise(resolve => setTimeout(resolve, 100)); // Increased delay for complex apps

  let selection;
  if (isGoogleSheets()) {
    selection = await getSelectionFromClipboard();
  } else {
    selection = window.getSelection().toString();
  }

  if (!selection) return;

  if (settings.excludeInputs && isEditable(document.activeElement)) return;

  const formattedSelection = formatText(selection, settings);
  if (formattedSelection.length < settings.minLength) return;

  if (settings.deduplication && formattedSelection === lastCopiedText) return;

  const success = await copyToClipboard(formattedSelection);
  if (success) {
    lastCopiedText = formattedSelection;
  }
}

// --- Initialization ---

function initialize() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('QuickCopy: Error getting settings:', chrome.runtime.lastError);
      return;
    }
    
    settings = response;
    console.log('QuickCopy: Settings loaded', settings);

    // Remove existing event listeners
    document.removeEventListener('mouseup', handleSelection, true);
    document.removeEventListener('dblclick', handleSelection, true);
    document.removeEventListener('click', handleSelection, true);

    document.addEventListener('mouseup', handleSelection, true);
    document.addEventListener('dblclick', handleSelection, true);
    document.addEventListener('click', handleSelection, true);
  });
}

// --- Initialization ---

function initialize() {
  chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('QuickCopy: Could not get settings.', chrome.runtime.lastError);
      return;
    }
    settings = response;
    
    document.removeEventListener('mouseup', handleSelection, true);
    document.removeEventListener('dblclick', handleSelection, true);
    document.removeEventListener('click', handleSelection, true);

    document.addEventListener('mouseup', handleSelection, true);
    document.addEventListener('dblclick', handleSelection, true);
    document.addEventListener('click', handleSelection, true);
  });
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    initialize();
  }
});

initialize();
