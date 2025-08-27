const defaultSettings = {
  autoCopy: true,
  events: {
    drag: true,
    dblclick: true,
    tripleclick: true
  },
  trimWhitespace: true,
  collapseWhitespace: false,
  newlineToSpace: false,
  decodeUrls: false,
  minLength: 1,
  excludeInputs: true,
  deduplication: true,
  domainMode: 'blocklist',
  blockedDomains: []
};



chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    chrome.storage.sync.set(defaultSettings, () => {
      console.log('QuickCopy: Default settings saved');
    });
  }
});

// Listen for extension icon click
chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

// Listen for messages from content scripts or UI
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSettings') {
    chrome.storage.sync.get(null, (settings) => {
      const currentSettings = { ...defaultSettings, ...settings };
      sendResponse(currentSettings);
    });
    return true; // Indicates that the response is sent asynchronously
  } else if (request.action === 'paste') {
    // This message is handled by content script
    return false;
  }
});
