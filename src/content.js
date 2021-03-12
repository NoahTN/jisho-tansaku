import { searchAndDisplay } from './utils/jisho-iframe';

chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) => {
      console.log(request);
      searchAndDisplay(request);
   }
);