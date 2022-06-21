import React from 'react';
import getObjectsFromHTML from './parser';
import Constants from './constants';
import Draggable from 'react-draggable';
import { throttle } from './common-functions';
// TODO: loading symbol, scroll to top when searching, multiple pages, wikipedia expanding, behaviour with regex (ex. wild cards)

function JFrame(props) {
   const jFrameRef = React.useRef();
   const searchbarRef = React.useRef();
   const [searchText, setSearchText] = React.useState("");
   const [lastSearchedText, setLastSearchedText] = React.useState("");
   const [searchResults, setSearchResults] = React.useState([]);
   const [resultCountText, setResultCountText] = React.useState("");
   const [posAndBounds, dispatch] = React.useReducer((state, action) => {
      switch(action.type) {
         case Constants.ACTION_UPDATE:
            return {
               bottomBounds: document.documentElement.clientHeight - jFrameRef.current.offsetHeight,
               rightBounds:document.documentElement.clientWidth - jFrameRef.current.offsetWidth
            };
         default:
            throw new Error();
      }
   }, {
      bottomBounds: document.documentElement.clientHeight - props.height,
      rightBounds: document.documentElement.clientWidth - props.width
   });

   React.useEffect(() => {
      searchbarRef.current.focus();

      chrome.runtime.sendMessage({type: Constants.TYPE_SIGNAL_READY}, (response) => {
         if(response) {
            setSearchText(response);
            searchUsingText(response);
         }
      });

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
         if (request.type === Constants.TYPE_SEARCH_CONTEXT) {
            setSearchText(request.data);
            searchUsingText(request.data);
         }
         sendResponse(true);
         return true;
      });

      window.addEventListener('resize', onWindowResize);

      new ResizeObserver(throttle(() => {
         if(jFrameRef.current.offsetWidth) {
            chrome.storage.sync.set({width: jFrameRef.current.offsetWidth, height: jFrameRef.current.offsetHeight});
         }
         dispatch({type: Constants.ACTION_UPDATE});
      }, 250)).observe(jFrameRef.current);

      // return () => {
      //    window.removeEventListener('resize', onWindowResize);
      // };
   }, []);

   function searchUsingText(text) {
      if(text) {
         chrome.runtime.sendMessage({type: Constants.TYPE_SEARCH_FETCH, data: text}, (response) => {
            let result = getObjectsFromHTML(response);
            // console.log(result[0]);
            if(result[1]) {
               setSearchResults(result[0]);
               setResultCountText(result[1]);
            }
            setLastSearchedText(text);
         });
      }
   }

   function onWindowResize() {
      dispatch({type: Constants.ACTION_UPDATE});
   };

   function handleSubmit(event) {
      event.preventDefault();
      searchUsingText(searchText);
   };

   function getSearchResults() {
      if(!lastSearchedText) {
         return;
      }

      if(searchResults.length > 0) {
         return searchResults.map((entry, index) =>
            <DictEntry
               furigana={entry.furigana}
               chars={entry.chars}
               defs={entry.defs}
               key={index}
            />
         );

      }

      return <div>
         Sorry, couldn't find anything matching {lastSearchedText}.
      </div>;
   }

   function handleDragStop(e, data) {
      chrome.storage.sync.set({x: data.x, y: data.y});
   }

   return (
      <Draggable 
         handle=".drag-handle" 
         bounds={{
            top: 0, 
            left: 0, 
            right: posAndBounds.rightBounds, 
            bottom: posAndBounds.bottomBounds
         }}
         defaultPosition={{x: props.defaultX, y: props.defaultY}}
         onStop={handleDragStop}
      >
         <div id="jf-content" ref={jFrameRef} style={{width: props.width+"px", height: props.height+"px"}}>
            <div className="drag-handle"></div>
            <form id="jf-form" onSubmit={handleSubmit}>
               <div id="jf-form-inner">
                  <input id="jf-searchbar" 
                     type="text" 
                     value={searchText} 
                     onChange={e => setSearchText(e.target.value)} 
                     autoComplete="off" 
                     spellCheck="false" 
                     placeholder="Search Jisho"
                     ref={searchbarRef}
                  >
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