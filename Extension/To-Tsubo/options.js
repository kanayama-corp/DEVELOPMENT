document.addEventListener('DOMContentLoaded', function() {
  const openShortcutsBtn = document.getElementById('open-shortcuts');
  const currentShortcut = document.getElementById('current-shortcut');
  const currentCopyShortcut = document.getElementById('current-copy-shortcut');
  const shortcutInput = document.getElementById('shortcut-input');
  const saveShortcutBtn = document.getElementById('save-shortcut');
  const resetShortcutBtn = document.getElementById('reset-shortcut');

  // Get current shortcut from Chrome API
  function updateCurrentShortcut() {
    chrome.commands.getAll().then((commands) => {
      const executeActionCommand = commands.find(cmd => cmd.name === '_execute_action');
      if (executeActionCommand && executeActionCommand.shortcut) {
        currentShortcut.textContent = executeActionCommand.shortcut;
      } else {
        currentShortcut.textContent = '設定されていません';
      }
    }).catch(() => {
      currentShortcut.textContent = 'Ctrl+Shift+T (デフォルト)';
    });
  }

  function formatShortcutText(sc) {
    if (!sc) return '未設定（Cmd/Ctrl + C ）';
    const parts = [];
    if (sc.ctrlKey) parts.push('Ctrl');
    if (sc.metaKey) parts.push('Cmd');
    if (sc.altKey) parts.push('Alt');
    if (sc.shiftKey) parts.push('Shift');
    // Do not append the main key if it is a modifier key
    const isModifierKey = sc.key === 'Shift' || sc.key === 'Ctrl' || sc.key === 'Control' || sc.key === 'Alt' || sc.key === 'Meta' || sc.key === 'Cmd' || sc.key === 'Option';
    if (sc.key && !isModifierKey) {
      parts.push(sc.key.length === 1 ? sc.key.toUpperCase() : sc.key);
    }
    return parts.join('+') || '未設定（Cmd/Ctrl + C ）';
  }

  function updateCurrentCopyShortcut() {
    chrome.storage.sync.get(['copyShortcut'], (res) => {
      currentCopyShortcut.textContent = formatShortcutText(res.copyShortcut);
    });
  }

  // Capture key combo into the input
  shortcutInput.addEventListener('keydown', (e) => {
    e.preventDefault();
    const sc = {
      ctrlKey: e.ctrlKey,
      metaKey: e.metaKey,
      altKey: e.altKey,
      shiftKey: e.shiftKey,
      key: e.key
    };
    // Normalize key string
    const specialMap = {
      ' ': 'Space',
      'Escape': 'Esc',
      'ArrowUp': 'ArrowUp',
      'ArrowDown': 'ArrowDown',
      'ArrowLeft': 'ArrowLeft',
      'ArrowRight': 'ArrowRight'
    };
    if (sc.key.length === 1) {
      sc.key = sc.key.toUpperCase();
    } else if (specialMap[sc.key]) {
      sc.key = specialMap[sc.key];
    }
    // If only a modifier key was pressed, do not set it as the main key
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt' || e.key === 'Meta') {
      sc.key = '';
    }
    shortcutInput.value = formatShortcutText(sc);
    // Temporarily store on element for save button
    shortcutInput._pendingShortcut = sc;
  });

  saveShortcutBtn.addEventListener('click', () => {
    const sc = shortcutInput._pendingShortcut;
    if (!sc || (!sc.ctrlKey && !sc.metaKey && !sc.altKey && !sc.shiftKey)) {
      alert('少なくとも1つの修飾キー（Ctrl/Alt/Shift/Cmd）とキーを含めてください');
      return;
    }
    const isModifierKey = sc.key === 'Shift' || sc.key === 'Ctrl' || sc.key === 'Control' || sc.key === 'Alt' || sc.key === 'Meta' || sc.key === 'Cmd' || sc.key === 'Option';
    if (!sc.key || isModifierKey) {
      alert('有効なキー（修飾キー以外）を含めてください');
      return;
    }
    chrome.storage.sync.set({ copyShortcut: sc }, () => {
      shortcutInput.value = '';
      shortcutInput._pendingShortcut = null;
      updateCurrentCopyShortcut();
    });
  });

  resetShortcutBtn.addEventListener('click', () => {
    chrome.storage.sync.remove('copyShortcut', () => {
      shortcutInput.value = '';
      shortcutInput._pendingShortcut = null;
      updateCurrentCopyShortcut();
    });
  });

  updateCurrentShortcut();
  updateCurrentCopyShortcut();

  // Open Chrome shortcuts settings
  openShortcutsBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'chrome://extensions/shortcuts'
    });
  });
});