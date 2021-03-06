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
      chrome.tabs.sendMessage(tab.id, {type: "search", data: info.selectionText});
   } 
});