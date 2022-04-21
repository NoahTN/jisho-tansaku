import React from 'react';
import search from "./search";

function JFrame(props) {
   const [searchText, setSearchText] = React.useState("");

   const testEntry = {};
   testEntry["furigana"] = ["ため"];
   testEntry["jfChars"] = "試し";
   testEntry["meanings"] = [
      {
         type: "Noun",
         text: "trial; test"
      }
   ];
   testEntry["forms"] = "験し 【ためし】、験 【ためし】";

   function handleSubmit(event) {
      event.preventDefault();
      search(searchText);
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
            <DictEntry {...testEntry} />
         </div>
      </div>
   );
}

function DictEntry(props) {
   return (
      <div className="jf-entry">
         <div className="jf-info">
            <div className="jf-furigana">
               {props.furigana.map((chars, index) => {
                  return <span key={index}>{chars}</span>;
               })}
            </div>
            <div className="jf-chars">{props.jfChars}</div>
         </div>
         <div className="jf-meanings">
            {props.meanings.map((meaning, index) => {
               return (
                  <React.Fragment key={index}>
                     <div className="jf-tag">{meaning.type}</div>
                     <div className="jf-def">
                        <span className="jf-def-num">{index+1}. </span>
                        <span className="jf-def-text">{meaning.text}</span>
                     </div>
                  </React.Fragment>
               );
            })}
            <div className="jf-tag">Other forms</div>
            <div className="jf-forms">{props.forms}</div>
         </div>
      </div>
   );
}

export default JFrame;