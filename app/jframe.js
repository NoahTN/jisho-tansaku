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
      <div id="jf-content">
         <input id="jf-search"></input>
            <h4>
               Words
               <span>- 404 found</span>
            </h4>
            <div id="jf-results">
               <DictEntry/>
            </div>
      </div>
   );
}

function DictEntry() {
   return (
      <div className="jf-entry">
         <div className="jf-info">
            <div className="jf-furigana">
               <span>ため</span>
            </div>
            <div className="jf-chars">試し</div>
         </div>
         <div className="jf-definitions">
            <div className="jf-tag">Noun</div>
            <div className="jf-def-list">
               <li className="jf-def">trial; test</li>   
            </div>
            <div className="jf-tag">Other forms</div>
            <div className="jf-forms">験し 【ためし】、験 【ためし】</div>
         </div>
      </div>
   );
}

export default JFrame;