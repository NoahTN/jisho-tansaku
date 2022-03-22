import React from 'react';
import ReactDOM from 'react-dom';
import './content.css'

chrome.storage.sync.get(["width", "height"], (data) => {
   const jframe = <JFrame width={data.width} height={data.height} />;
   let target = document.getElementById("jframe");
   if(target == null) {
      const container = document.createElement("div");
      container.id = "jframe";
      target = document.body.appendChild(container);
   }
   ReactDOM.render(jframe, target);
});

function JFrame(props) {
   const [width, setWidth] = React.useState(props.width);
   const [height, setHeight] = React.useState(props.height);
   const [display, setDisplay] = React.useState("none");

   React.useEffect(() => {
      const mappings = {
         "resz-w": (data) => {
            chrome.storage.sync.set({width: data});
            setWidth(data);
         },
         "resz-h": (data) => {
            chrome.storage.sync.set({height: data});
            setHeight(data);
         },
         "search": (data) => {
            console.log(data);
         },
      }

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         console.log(mappings[request.type]);
         mappings[request.type](request.data);
         setDisplay("block");
      });

      document.addEventListener('click', function(e) {
         setDisplay("none");
      });

      function search(text) {
         // CORS Error without a proxy
         try {
            // jframe.src = "https://jisho.org/search/"+text;
         }
         catch(error) {
            console.error(error);
         }
      }
   }, []);

   return (
      <div 
         style={{
            top: `${document.documentElement.scrollTop + document.documentElement.clientHeight/2 + "px"}`,
            display: `${display}`,
            marginTop: `-${height/2}px`,
            marginLeft: `-${width/2}px`,
            width: `${width}px`,
            height: `${height}px`
         }}
      >
         <div>Search Bar</div>
      </div>
   );
}


