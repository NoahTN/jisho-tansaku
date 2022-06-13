import React, { useEffect } from 'react';
import getObjectsFromHTML from './parser';
import Constants from './constants';
import Draggable from 'react-draggable';

function JFrame(props) {
   const [searchText, setSearchText] = React.useState("");
   const [lastSearchedText, setLastSearchedText] = React.useState("");
   const [searchResults, setSearchResults] = React.useState([]);
   const [resultCountText, setResultCountText] = React.useState("");
   const [leftBounds, setLeftBounds] = React.useState(-document.documentElement.clientWidth/2 + 650/2);
   const [rightBounds, setRightBounds] = React.useState(document.documentElement.clientWidth/2 - 650/2);

   useEffect(() => {
      window.addEventListener('resize', onWindowResize);

      return () => {
         window.removeEventListener('resize', onWindowResize);
      };
   });

   function onWindowResize() {
      setLeftBounds(-document.documentElement.clientWidth/2 + 650/2);
      setRightBounds(document.documentElement.clientWidth/2 - 650/2);
   };

   function handleSubmit(event) {
      event.preventDefault();
      if(searchText) {
         chrome.runtime.sendMessage(searchText, function(response) {
            let result = getObjectsFromHTML(response);
            // console.log(result[0]);
            setSearchResults(result[0]);
            setResultCountText(result[1]);
            setLastSearchedText(searchText);
         });
      }
   };

   function getSearchResults() {
      if(!lastSearchedText) {
         return;
      }

      if(searchResults.length > 0) {
         return searchResults.map(entry =>
            <DictEntry
               furigana={entry.furigana}
               chars={entry.chars}
               defs={entry.defs}
               key={entry.chars}
            />
         );

      }

      return <div>
         Sorry, couldn't find anything matching {lastSearchedText}
      </div>;
   }

   return (
      <Draggable 
         handle=".drag-handle" 
         // bounds="body"
         
         bounds={{
            top: -document.documentElement.clientHeight/2 + 500/2, 
            left: leftBounds, 
            right: rightBounds, 
            bottom: document.documentElement.clientHeight/2 - 500/2
         }}
         // defaultPosition={{x: document.documentElement.clientHeight/2 - 650/2, y: document.documentElement.scrollTop + document.documentElement.clientHeight/2 - 500/2}}
      >
         <div id="jf-content">
            <div className="drag-handle"></div>
            <form id="jf-form" onSubmit={handleSubmit}>
               <div id="jf-form-inner">
                  <input id="jf-searchbar" 
                     type="text" 
                     value={searchText} 
                     onChange={e => setSearchText(e.target.value)} 
                     autoComplete="off" 
                     spellCheck="false" 
                     placeholder="Search Jisho">
                  </input>
                  <button id="jf-submit-btn" type="submit">
                     <div>🔍︎</div>
                  </button>
               </div>
            </form>
            {resultCountText.length > 0 &&
               <h4>
                  Words
                  <span>{resultCountText}</span>
               </h4>
            }
            <div id="jf-results">
               { getSearchResults() }
            </div>
         </div>   
      </Draggable>
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