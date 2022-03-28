import React from 'react';
import ReactDOM from 'react-dom';
import JFrame from './jframe';
import './content.css'

let target = document.getElementById("jframe");

if(target == null) {
   chrome.storage.sync.get({ width: 650, height: 500 }, (data) => {
      const jframe = <JFrame width={data.width} height={data.height} />;
      const container = document.createElement("div");
      container.id = "jframe";
      target = document.body.appendChild(container);
      target.style.top = `${document.documentElement.scrollTop + document.documentElement.clientHeight/2 + "px"}`
      
      const mappings = {
         "resz-w": (data) => {
            chrome.storage.sync.set({width: data});
            jframe.style.width = data+"px";
            jframe.style.marginLeft = "-"+(data/2)+"px";
         },
         "resz-h": (data) => {
            chrome.storage.sync.set({height: data});
            jframe.style.height = data+"px";
            jframe.style.marginTop = "-"+(data/2)+"px";
         },
         "search": (data) => {
            console.log(data);
         },
      }

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         mappings[request.type](request.data);
         target.style.display = "block";
         sendResponse({});
         return true;
      });
      document.addEventListener('click', function(e) {
         if(!document.getElementById('jframe').contains(e.target)) {
            target.style.display = "none";
         }
      });

      ReactDOM.render(jframe, target);
   });
}
else {
   target.style.display = "block";
   target.style.top = `${document.documentElement.scrollTop + document.documentElement.clientHeight/2 + "px"}`
}

