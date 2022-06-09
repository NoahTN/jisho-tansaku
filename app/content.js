import React from 'react';
import ReactDOM from 'react-dom';
import JFrame from './jframe';

let target = document.getElementById("jframe");

if(target == null) {
   require("./content.css");

   chrome.storage.sync.get({ width: 650, height: 500 }, (data) => {
      const jframe = <JFrame/>;
      const container = document.createElement("div");
      // const mappings = {
      //    "resz-w": (data) => {
      //       chrome.storage.sync.set({width: data});
      //       jframe.style.width = data+"px";
      //       jframe.style.marginLeft = "-"+(data/2)+"px";
      //    },
      //    "resz-h": (data) => {
      //       chrome.storage.sync.set({height: data});
      //       jframe.style.height = data+"px";
      //       jframe.style.marginTop = "-"+(data/2)+"px";
      //    },
      //    "search": (data) => {
      //       console.log(data);
      //    },
      // }
      container.id = "jframe";
      target = document.body.appendChild(container);
      target.style.top = `${document.documentElement.scrollTop + document.documentElement.clientHeight/2 - data.height/2 + "px"}`
      target.style.left = `${document.documentElement.clientWidth/2 - data.width/2 + "px"}`
      // target.style.width = `${data.width}px`
      // target.style.marginLeft = `-${data.width/2}px`;
      // target.style.height = `${data.height}px`
      // target.style.marginTop = `-${document.documentElement.scrollTop + document.documentElement.clientHeight/2 - data.height/2 + "px"}`

      document.addEventListener('mousedown', function(e) {
         if(!document.getElementById('jframe').contains(e.target)) {
            target.style.display = "none";
         }
      });

      ReactDOM.render(jframe, target, () => {document.getElementById("jf-searchbar").focus()});
   });
}
else {
   target.style.display = "block";
   target.style.top = `${document.documentElement.scrollTop + document.documentElement.clientHeight/2 - 500/2 + "px"}`
   document.getElementById("jf-searchbar").focus();
}


