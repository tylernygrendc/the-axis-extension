chrome.action.onClicked.addListener(async function() {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    let response = await chrome.tabs.sendMessage(tab.id, { source: "action" });
});