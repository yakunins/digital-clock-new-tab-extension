chrome.runtime.onMessage.addListener((request, sender) => {
    if ((request = "openPopup")) {
        chrome.action?.openPopup?.({ windowId: sender.tab?.windowId });
    }
});
