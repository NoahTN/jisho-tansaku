import * as JIFrame from './utils/jisho-iframe';

JIFrame.insert();

chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) => {
      JIFrame.display(request);
   }
);

document.addEventListener('click', function(e) {
   if (JIFrame.displaying && !document.getElementById('jiframe').contains(e.target)){
      JIFrame.hide()
   }
});