// popup opener (unused)
chrome.runtime.onMessage.addListener((request, sender) => {
    if (request === "open_extension_popup") {
        chrome.action?.openPopup?.({ windowId: sender.tab?.windowId });
    }
});
