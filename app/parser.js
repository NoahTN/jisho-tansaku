import { parse } from "node-html-parser";

export default function getObjectsFromHTML(rawHTML) {
   const root = parse(rawHTML);
   const result = [];
   root.set_content(root.querySelector("#primary"));
   let content = root.querySelectorAll("[class='concept_light clearfix']");
   console.log(content);
   // for(const entry of content) {
   //    result.push({
   //       "furigana": parseFurigana(entry.childNodes[1].childNodes[1].childNodes[1]),
   //       "chars": [],
   //       "defs": [],
   //       "other": ""
   //    });  
   // }
}

function parseFurigana(nodes) {
   let result = [];
  
}

function parseChars() {

}

function parseDefs() {
   
}

function parseOtherForms(){

}