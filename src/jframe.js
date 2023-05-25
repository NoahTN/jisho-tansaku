import { useEffect, useRef, useState, useReducer } from "react";
import { getObjectsFromHTML } from "./tools/parser";
import Draggable from "react-draggable";
import { throttle } from "./tools/common-functions";
import DictEntry  from "./templates/dict-entry";
import KanjiEntry from "./templates/kanji-entry";
// TODO:  behaviour with regex (ex. wild cards)

function JFrame(props) {
    const jFrameRef = useRef();
    const searchbarRef = useRef();
    const furthestPage = useRef(-1);
    const isLastPage = useRef();
    const lastSearchedText = useRef();
    const obeserverRef = useRef(null);
    const prevDocHeight = useRef(document.documentElement.clientHeight);
    const [displayLoading, setDisplayLoading] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [resultCountText, setResultCountText] = useState("");
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
            const result = getObjectsFromHTML(response);
            if(page > 0) {
               setSearchResults(prev => [...prev].concat(result.entries));
            }
            else {
               setSearchResults(result.entries);
               setResultCountText(result.countText ? result.countText : "");
            }
            furthestPage.current = page;
            isLastPage.current = result.isLastPage;
            lastSearchedText.current = text;
            setDisplayLoading(false);
         });
      }
   }

   function onWindowResize() {
      if(document.documentElement.clientHeight !== prevDocHeight.current && jFrameRef.current.offsetHeight) {
         chrome.storage.sync.get("y", (data) => {
            jFrameRef.current.style.height = Math.min(document.documentElement.clientHeight, jFrameRef.current.offsetHeight+data.y)+"px";
         });
         prevDocHeight.current = document.documentElement.clientHeight;
      }
      updateBounds();
   };

   function handleSubmit(event) {
      event.preventDefault();
      searchUsingText(searchText);
   };

   function handleDragStart(e) {
      document
   }

   function handleDragStop(e, data) {
      console.log([data.x, data.y]);
      chrome.storage.sync.set({x: data.x, y: data.y});
   }

   return (
      <Draggable 
         handle=".drag-handle" 
         bounds={{
            top: 0, 
            left: 2, 
            right: bounds.right-2, 
            bottom: bounds.bottom
         }}
         defaultPosition={{x: props.defaultX+props.width <= document.documentElement.clientWidth ? props.defaultX : document.documentElement.clientWidth-props.width, y: props.defaultY}}
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
            {resultCountText.length > 0 &&
               <h4>
                  Words
                  <span>{ resultCountText }</span>
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
                  <Credits/>
               </div>
                : null
            }
            </div>
            {!resultCountText.length ? <Credits /> : null}
         </div>   
      </Draggable>
   );
}

function Credits() {
   return <div className="credits">
      <div>All data from <a href="https://jisho.org/" target="_blankl" rel="noopener noreferrer">https://jisho.org/</a></div>
   </div>
}

export default JFrame;