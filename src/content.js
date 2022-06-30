import React from 'react';
import ReactDOM from 'react-dom';
import JFrame from './jframe';

let target = document.getElementById("jframe");

if(target === null) {
   require("./content.css");

   chrome.storage.sync.get({width: 650, height: 500, x: document.documentElement.clientWidth/2 - 325, y: document.documentElement.clientHeight/2 - 250}, (data) => {
      const jframe = <JFrame width={data.width} height={data.height} defaultX={data.x} defaultY={data.y}/>;
      const container = document.createElement("div");
      container.id = "jframe";
      target = document.body.appendChild(container);

      document.addEventListener("mousedown", function(e) {
         if(!document.getElementById('jframe').contains(e.target)) {
            target.style.display = "none";
         }
      });

      ReactDOM.render(jframe, target);
   });
}
else {
   target.style.display = "block";
   document.getElementById("jf-searchbar").focus();
}


