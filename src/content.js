import * as JIFrame from './jisho-iframe';

chrome.storage.local.get(["width", "height"], function(data) {
   JIFrame.insert(data.width, data.height);
 });

chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) => {
      if(request.type == "search") {
         JIFrame.search(request.data);
         JIFrame.display();
      }
      else if(request.type == "resz-w") {
         JIFrame.resizeWidth(request.data)
      }
      else {
         JIFrame.resizeHeight(request.data)
      }
   }
);

document.addEventListener('click', function(e) {
   if (JIFrame.displaying && !document.getElementById('jiframe').contains(e.target)){
      JIFrame.hide()
   }
});