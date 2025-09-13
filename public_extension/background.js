chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "visualSearchWithScreenshot",
    title: "Visual Search",
    contexts: ["page"],
  });
});

// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (info.menuItemId === "visualSearchWithScreenshot") {
//     chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
//       if (chrome.runtime.lastError || !dataUrl) {
//         console.error("Failed to capture tab:", chrome.runtime.lastError?.message);
//         return;
//       }
//       chrome.storage.local.set({ screenshotUrl: dataUrl }, () => {
//         chrome.windows.create({
//           url: "index.html",
//           type: "popup",
//           width: 1200,
//           height: 800,
//         });
//       });
//     });
//   }
// });

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "visualSearchWithScreenshot") {
    
    // 1. Open the side panel immediately. This is a direct response to the user's click.
    chrome.sidePanel.open({ tabId: tab.id });

    // 2. Then, perform the asynchronous work of taking and saving the screenshot.
    chrome.tabs.captureVisibleTab(tab.windowId, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError || !dataUrl) {
        console.error("Failed to capture tab:", chrome.runtime.lastError?.message);
        return;
      }
      // Save the screenshot URL to local storage for the side panel to retrieve.
      chrome.storage.local.set({ screenshotUrl: dataUrl });
    });
  }
});