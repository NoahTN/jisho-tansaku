import { searchAndLoad } from './components/jisho-iframe';

chrome.runtime.onMessage.addListener(
   (request, sender, sendResponse) => {
      console.log(request);
      searchAndLoad(request);
   }
);