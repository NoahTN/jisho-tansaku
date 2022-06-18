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
         console.log(info.selectionText);
         chrome.tabs.sendMessage(tab.id, {type: Constants.TYPE_SEARCH_CONTEXT, data: info.selectionText});
      }
      tabAndTextMap[tab.id] = info.selectionText;
      chrome.scripting.executeScript({
         target: {tabId: tab.id},
         files: ["content.js"]
      });
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
   if(request.type === Constants.TYPE_SEARCH_FETCH) {
      tabAndTextMap[sender.tab.id] = request.data;
      fetch("https://jisho.org/search/"+tabAndTextMap[sender.tab.id])
         .then((res) => res.text())
         .then((text) => {
            sendResponse(text);
         });
      return true;
   }
   else if(request.type === Constants.TYPE_SIGNAL_READY) {
      if(tabAndTextMap[sender.tab.id]) {
         sendResponse(tabAndTextMap[sender.tab.id]);
      }
      else {
         sendResponse("");
      }
   }
 });