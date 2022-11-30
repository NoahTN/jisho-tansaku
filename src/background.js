import Constants from "./constants"

const tabAndTextMap = {};

chrome.runtime.onInstalled.addListener(function() {
   chrome.contextMenus.create({
      "id": "my-menu",
      "title": "Search Jisho",
      "contexts": ["selection"]
   });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
   if (info.menuItemId === "my-menu") {
      // Calling context menu when already activated
      if(tab.id in tabAndTextMap && info.selectionText) {
         chrome.tabs.sendMessage(tab.id, {type: Constants.TYPE_SEARCH_CONTEXT, data: info.selectionText});
      }
      if(tabAndTextMap[tab.id] === info.selectionText) {
         chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["content.js"]
         });
      }
      else {
         chrome.scripting.executeScript({
            target: {tabId: tab.id},
            files: ["content_show_scroll_only.js"]
         });
      }
      tabAndTextMap[tab.id] = info.selectionText;
   }
});

chrome.action.onClicked.addListener((tab) => {
   tabAndTextMap[tab.id] = "";
   chrome.scripting.executeScript({
     target: {tabId: tab.id},
     files: ["content.js"]
   });
 });

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   switch(request.type) {
      case Constants.TYPE_SEARCH_FETCH:
         tabAndTextMap[sender.tab.id] = request.data;
         fetch("https://jisho.org/search/"+tabAndTextMap[sender.tab.id]+(request.page ? ("%20%23words?page="+request.page) : ""))
            .then(res => res.text())
            .then(text => {
               sendResponse(text);
            });
         break;
      case Constants.TYPE_READ_MORE:
         fetch(request.url)
         .then(res => res.text())
         .then(text => {
            sendResponse(text);
         });
         break;
      case Constants.TYPE_SIGNAL_READY:
         sendResponse(tabAndTextMap[sender.tab.id] || "");
         break;

   }
   return true;
 });