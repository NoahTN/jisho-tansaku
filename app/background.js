chrome.runtime.onInstalled.addListener(function() {
   chrome.contextMenus.create({
      "id": "my-menu",
      "title": "Search Jisho",
      "contexts": ["selection"]
   });
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

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   let input = request;
   fetch("https://jisho.org/search/"+input)
      .then((res) => res.text())
      .then((text) => {
         sendResponse(text);
      });
   return true;
 });