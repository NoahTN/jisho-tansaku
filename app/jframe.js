import React from 'react';
import getObjectsFromHTML from './parser';
import Constants from './constants';

function JFrame(props) {
   const [searchText, setSearchText] = React.useState("");
   const [searchResults, setSearchResults] = React.useState([]);

   function handleSubmit(event) {
      event.preventDefault();
      chrome.runtime.sendMessage(searchText, function(response) {
         let result = getObjectsFromHTML(response);
         console.log(result);
         setSearchResults(result);
      });
   };

   return (
      <div id="jf-content">
         <form onSubmit={handleSubmit}>
            <input type="text" value={searchText} onChange={e => setSearchText(e.target.value)} id="jf-search"></input>
            <input type="submit" value="submit"></input>
         </form>
         <h4>
            Words
            <span> — 404 found</span>
         </h4>
         <div id="jf-results">
            {searchResults.map(entry => {
               return <DictEntry
                  furigana={entry.furigana}
                  chars={entry.chars}
                  defs={entry.defs}
                  key={entry.chars}
               />
            })}
         </div>
      </div>
   );
}

function DictEntry(props) {
   return (
      <div className="jf-entry">
         <div className={"jf-info" + (props.chars.length > 5 ? " jf-info-long" : "")}>
            <div className="jf-furigana">
               {props.furigana.map((furi, index) => {
                  return <span key={index} className={furi ? "kana" : ""}>{furi}</span>;
               })}
            </div>
            <div className="jf-chars">{props.chars}</div>
         </div>
         <div className={"jf-defs" + (props.chars.length > 5 ? " jf-defs-long" : "")}>
            {props.defs.map((def, index) => {
               return (
                  <React.Fragment key={index}>
                     <div className="jf-tag">{def.tag}</div>
                     <div className="jf-def">
                        {(() => {
                           switch(def.type) {
                              case Constants.WIKIPEDIA_DEF:
                                 return <>
                                    <span className="jf-def-text">{def.data[0]}</span>
                                    <span className="jf-def-abs">{def.data[1]}</span>
                                 </>
                              case Constants.OTHERS_DEF:
                                 return <>
                                    {def.data.map((form, formIndex) => {
                                       return <span key={formIndex}>{form + (formIndex < def.data.length-1 ? "、" : "")}</span>
                                    })}
                                 </>
                              case Constants.NOTES_DEF:
                                 return <span className="jf-def-notes">{def.data[0]}</span>
                              default:
                                 return <>
                                    <span className="jf-def-num">{index+1}. </span>
                                    <span className="jf-def-text">{def.data[0]}</span>
                                    {def.data.length > 1 ? <span className="jf-def-supp">{def.data[1]}</span> : ""}
                                 </>
                           }
                        }
                        )()}
                     </div>
                  </React.Fragment>
               );
            })}
         </div>
      </div>
   );
}

export default JFrame;