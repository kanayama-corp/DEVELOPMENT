document.addEventListener('DOMContentLoaded', function() {
  const openShortcutsBtn = document.getElementById('open-shortcuts');
  const currentShortcut = document.getElementById('current-shortcut');

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

  updateCurrentShortcut();

  // Open Chrome shortcuts settings
  openShortcutsBtn.addEventListener('click', function() {
    chrome.tabs.create({
      url: 'chrome://extensions/shortcuts'
    });
  });
});