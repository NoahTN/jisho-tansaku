chrome.runtime.onInstalled.addListener(function() {
   chrome.contextMenus.create({
      "id": "my-menu",
      "title": "Search Jisho",
      "contexts": ["selection"]
   });
   chrome.storage.sync.set({ width: 650, height: 500});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
   if (info.menuItemId === "my-menu") {
      chrome.scripting.executeScript({
         target: { tabId: tab.id },
         files: ["content.js"]
      }, () => {
         chrome.tabs.sendMessage(tab.id, {type: "search", data: info.selectionText})
      });
   }
});

chrome.action.onClicked.addListener((tab) => {
   chrome.scripting.executeScript({
     target: { tabId: tab.id },
     files: ["content.js"]
   });
 });