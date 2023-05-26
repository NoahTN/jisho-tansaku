const tabAndTextMap = {};

chrome.runtime.onInstalled.addListener(() => {
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
         chrome.tabs.sendMessage(tab.id, {type: "search-context", data: info.selectionText});
      }
      if(!tabAndTextMap[tab.id]) {
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
   const invalidDomains = new Set(["edge", "chrome"]);
   if(!invalidDomains.has(tab.url.split("://")[0])) {
      tabAndTextMap[tab.id] = "";
      chrome.scripting.executeScript({
        target: {tabId: tab.id},
        files: ["content.js"]
      });
   }
 });

 chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
   (async () => {
      const requestMap = {
         "search-query": async () => {
            tabAndTextMap[sender.tab.id] = request.data;
            const searchQuery = await fetch("https://jisho.org/api/v1/search/words?keyword=" + encodeURIComponent(tabAndTextMap[sender.tab.id]) + (request.page ? ("&page="+request.page) : ""));
            const searchQueryJSON = await searchQuery.json();
            console.log(searchQueryJSON);
            sendResponse(searchQueryJSON);
         },
         "read-more": async () => {
            const readMoreQuery = await fetch(request.url);
            const readMoreQueryJSON = await readMoreQuery.json();
            sendResponse(readMoreQueryJSON);
         },
         "signal-ready": () => {
            sendResponse(tabAndTextMap[sender.tab.id] || "");
         }
      };
      requestMap[request.type] ? requestMap[request.type]() : () => {throw new Error("Invalid Chrome message request to background")};
   })();
 
   return true;
 });