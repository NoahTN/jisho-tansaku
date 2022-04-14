import React from 'react';

function JFrame(props) {
   React.useEffect(() => {
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
      <div id="content">
         <input id="searchbar"></input>
            <div>Words - XX Found</div>
            <div id="results">
               <DictEntry/>
            </div>
      </div>
   );
}

function DictEntry() {
   return (
      <div className="entry">
         <div className="left">
            <div className="furigana">ため</div>
            <div className="chars">試し</div>
         </div>
         <div className="right">
            <div className="category-tag"></div>
            <div className="definitions">
               <li className="def">trial; test</li>   
            </div>
            <div className="forms-tag">Other forms</div>
            <div className="forms">験し 【ためし】、験 【ためし】</div>
         </div>
      </div>
   );
}

export default JFrame;