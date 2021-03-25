import * as JIFrame from './utils/jisho-iframe';

JIFrame.insert();

chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) => {
      if(request.type == "search") {
         JIFrame.display(request);
      }
      else if(request.type == "resize-w") {

      }
      else {

      }
   }
);

document.addEventListener('click', function(e) {
   if (JIFrame.displaying && !document.getElementById('jiframe').contains(e.target)){
      JIFrame.hide()
   }
});