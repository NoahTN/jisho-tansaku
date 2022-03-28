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
      <div>
         <input></input>
            <div>Words - XX Found</div>
            <ol className="results">
               <li>
                  <div className="chars">試し</div>
                  <ol className="definitions">
                     <li>trial; test</li>
                  </ol>
               </li>
            </ol>
      </div>
   );
}

export default JFrame;