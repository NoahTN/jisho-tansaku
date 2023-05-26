import { useState, useEffect, Fragment } from "react";
import { parseWikipediaDef } from "../tools/parser";
import Constants from "../tools/constants";
import "./dict-entry.css";

export default function DictEntry(props) {
   const [wikiDef, setWikiDef] = useState();

   useEffect(() => {
      let output = "";
      for(let def of props.defs) {
         if(def.type === Constants.WIKIPEDIA_DEF && def.link) {
            output = <a href={ "https:" + def.link.url.split(":")[1]} onClick={ handleReadMoreClick }>{ def.link.text }</a>
            break;
         }
      }
      setWikiDef(output);
   }, [props.defs]);

   function handleReadMoreClick(event) {
      event.preventDefault();
      chrome.runtime.sendMessage({type: "read-more", url: event.target.href}, (response) => {
         setWikiDef(parseWikipediaDef(response));
      });
   }

   return (
      <div className="jf-entry">
         <div className={"jf-info" + (props.chars.length > 5 ? " jf-info-long" : "")}>
            <div className="jf-furigana">
               { props.furigana }
               {/* <span className={"kana"}></span> */}
               {/* {props.furigana.map((furi, index) => {
                  return <span key={ index } className={furi ? "kana" : ""}>{ furi }</span>;
               })} */}
            </div>
            <div className="jf-chars">{ props.chars }</div>
         </div>
         <div className={"jf-defs" + (props.chars.length > 5 ? " jf-defs-long" : "")}>
            {props.defs.map((def, index) => {
               return (
                  <Fragment key={ index }>
                     <div className="jf-tag">{ def.tag }</div>
                     <div className="jf-def">
                        {(() => {
                           switch(def.type) {
                              case Constants.WIKIPEDIA_DEF:
                                 return <>
                                    <span className="jf-def-num">{ index+1 }. </span>
                                    <span className="jf-def-text">{ def.data[0] }</span>
                                    <span className="jf-def-abs">{ wikiDef }</span>
                                 </>
                              case Constants.OTHERS_DEF:
                                 return <>
                                    {def.data.map((form, formIndex) => {
                                       return <span key={ formIndex }>{form + (formIndex < def.data.length-1 ? "、" : "")}</span>
                                    })}
                                 </>
                              case Constants.NOTES_DEF:
                                 return <span className="jf-def-notes">{def.data[0]}</span>
                              default:
                                 return <>
                                    <span className="jf-def-num">{ index+1 }. </span>
                                    <span className="jf-def-text">{ def.data[0] }</span>
                                    {def.data.length > 1 ? <span className="jf-def-supp">{ def.data[1] }</span> : ""}
                                 </>
                           }
                        }
                        )()}
                     </div>
                  </Fragment>
               );
            })}
         </div>
      </div>
   );
}