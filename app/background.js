import Constants from "./constants"

let textToSearch = "";

chrome.runtime.onInstalled.addListener(function() {
   chrome.contextMenus.create({
      "id": "my-menu",
      "title": "Search Jisho",
      "contexts": ["selection"]
   });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
   if(textToSearch) {
      console.log(info.selectionText);
      chrome.tabs.sendMessage(tab.id, {type: Constants.TYPE_SEARCH_CONTEXT, data: info.selectionText});
   }
   if (info.menuItemId === "my-menu") {
      textToSearch = info.selectionText;
      chrome.scripting.executeScript({
         target: { tabId: tab.id },
         files: ["content.js"]
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
   textToSearch = request.data;
   if(request.type === Constants.TYPE_SEARCH_FETCH) {
      let input = request.data;
      fetch("https://jisho.org/search/"+input)
         .then((res) => res.text())
         .then((text) => {
            sendResponse(text);
         });
      return true;
   }
   else if(request.type === Constants.TYPE_SIGNAL_READY && textToSearch) {
      sendResponse(textToSearch);
      return true;
   }
 });