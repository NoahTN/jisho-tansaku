import { useEffect, useRef, useState, useReducer } from "react";
import { getObjectsFromJSON } from "./tools/parser";
import Draggable from "react-draggable";
import { throttle } from "./tools/common-functions";
import DictEntry  from "./templates/dict-entry";
import KanjiEntry from "./templates/kanji-entry";
// TODO:  behaviour with regex (ex. wild cards)

const bodyPadding = [
   parseInt(window.getComputedStyle(document.body, null).getPropertyValue("padding-left").slice(0, -2)),
   parseInt(window.getComputedStyle(document.body, null).getPropertyValue("padding-right").slice(0, -2))
]

function JFrame(props) {
    const jFrameRef = useRef();
    const searchbarRef = useRef();
    const furthestPage = useRef(-1);
    const isLastPage = useRef();
    const lastSearchedText = useRef();
    const obeserverRef = useRef(null);
    const [displayLoading, setDisplayLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [resultCount, setResultCount] = useState(null);
    const [bounds, setBounds] = useState({bottom: document.documentElement.clientHeight - props.height, right: document.documentElement.clientWidth - props.width});

   useEffect(() => {
      chrome.runtime.sendMessage({type: "signal-ready"}, (response) => {
         if(response) {
            setSearchText(response);
            searchUsingText(response);
         }
      });
   
      window.addEventListener("resize", onWindowResize);
      obeserverRef.current = new ResizeObserver(throttle(() => {
         if(jFrameRef.current.offsetWidth) {
            chrome.storage.sync.set({width: jFrameRef.current.offsetWidth, height: jFrameRef.current.offsetHeight});
         }
         updateBounds();
      }, 1000));

      return () => {
         chrome.runtime.onMessage.removeListener(searchContext);
      }
   }, []);

   useEffect(() => {
      searchbarRef.current.focus();
      obeserverRef.current.observe(jFrameRef.current);
      
      return () => {
         obeserverRef.current.disconnect();
         jFrameRef.current.removeEventListener("scroll", onWindowResize);
      };
   }, [jFrameRef]);

   function updateBounds() {
      setBounds({
         bottom: document.documentElement.clientHeight - jFrameRef.current.offsetHeight,
         right: document.documentElement.clientWidth - jFrameRef.current.offsetWidth
      });
   }

   function searchContext(request, sender, sendResponse) {
      if (request.type === "search-context") {
         setSearchText(request.data);
         searchUsingText(request.data);
      }
      sendResponse(true);
      return true;
   }
 
   function searchUsingText(text) {
      const repeatedSearch = (text === lastSearchedText.current);
      if(!repeatedSearch) {
         jFrameRef.current.scrollTo(0, 0);
      }
      else if(isLastPage.current) {
         return;
      }
      
      if(text) {
         setDisplayLoading(true);
         const page = repeatedSearch ? (furthestPage.current+1) : 0;
         //console.log([text, lastSearchedText.current, page]);
         chrome.runtime.sendMessage({type: "search-query", data: text, page: (page+1)}, (response) => {
            const result = getObjectsFromJSON(response);
            console.log(result);
            if(page > 0) {
               setSearchResults(prev => [...prev].concat(result.entries));
            }
            else {
               setSearchResults(result.entries);
               setResultCount(result.count);
            }
            furthestPage.current = page;
            isLastPage.current = result.isLastPage;
            lastSearchedText.current = text;
            setDisplayLoading(false);
         });
      }
   }

   function onWindowResize() {
      updateBounds();
   };

   function handleSubmit(event) {
      event.preventDefault();
      searchUsingText(searchText);
   };

   function handleDragStart(e, data) {
      if(jFrameRef.current.offsetWidth+data.x >= document.documentElement.clientWidth-2) {
         jFrameRef.current.style.width = document.documentElement.clientWidth-2-data.x +"px";
      }
      if(jFrameRef.current.offsetHeight+data.y >= document.documentElement.clientHeight-2) {
         jFrameRef.current.style.height = document.documentElement.clientHeight-2-data.y + "px";
      }
   }

   function handleDragStop(e, data) {
      chrome.storage.sync.set({x: data.x, y: data.y});
   }

   return (
      <Draggable 
         handle=".drag-handle" 
         bounds={{
            top: 0, 
            left: 2 - bodyPadding[0], 
            right: bounds.right - 2 - bodyPadding[1], 
            bottom: bounds.bottom - 2
         }}
         defaultPosition={{
            x: props.defaultX+props.width <= document.documentElement.clientWidth-2 ? props.defaultX : document.documentElement.clientWidth-props.width, 
            y: props.defaultY+props.height <= document.documentElement.clientHeight-2 ? props.defaultY : document.documentElement.clientHeight-props.height}}
         onStart={ handleDragStart }
         onStop={ handleDragStop }
      >
         <div id="jf-content" ref={ jFrameRef } style={{width: props.width+"px", height: props.height+"px"}}>
            <div className="drag-handle"></div>
            <form id="jf-form" onSubmit={ handleSubmit }>
               <div id="jf-form-inner">
                  <input id="jf-searchbar" 
                     type="text" 
                     value={searchText} 
                     onChange={e => setSearchText(e.target.value)} 
                     autoComplete="off" 
                     spellCheck="false" 
                     placeholder="Search Jisho"
                     ref={ searchbarRef }
                  >
                  </input>
                  {displayLoading && <div className="lds-ring"><div></div><div></div><div></div><div></div></div>}
                  <button id="jf-submit-btn" type="submit">
                     <div>🔍︎</div>
                  </button>
               </div>
            </form>
            {resultCount > 0 &&
               <h4>
                  <Credits query={ lastSearchedText.current }/>
               </h4>
            }
            <div id="jf-results">{ 
               lastSearchedText.current && (searchResults.length ? 
                  searchResults.map((entry, index) =>
                     <DictEntry
                        furigana={ entry.furigana }
                        chars={ entry.chars }
                        defs={ entry.defs }
                        key={ index }
                     />
                  ) : (!displayLoading && <div id="jf-no-results">
                     Sorry, couldn't find anything matching { lastSearchedText.current }.
                  </div>)
               )}
            </div>
            <div id="jf-more-words">{
               (searchResults.length && !isLastPage.current) ? <div>
                  <a onClick={() => searchUsingText(lastSearchedText.current)}>More Words {">"}</a>
               </div>
                : null
            }
            </div>
            {!resultCount ? <Credits /> : null}
         </div>   
      </Draggable>
   );
}

function Credits(props) {
   const link = props.query ? "https://jisho.org/search/"+props.query : "https://jisho.org";
   return <div className="credits">
      <div>All data from <a href={ link } target="_blank" rel="noreferrer">{ link }</a></div>
   </div>
}

export default JFrame;