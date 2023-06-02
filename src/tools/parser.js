import { parse } from "node-html-parser";
import Constants from "./constants";

export function getObjectsFromJSON(json) {
   const content = json.data;
   const entries = [];
   for(const entry of content) {
      entries.push({
         furigana: parseFurigana(entry),
         chars: parseChars(entry),
         defs: parseDefs(entry),
         isCommon: entry.is_common ?? false,
         jlptLevel: entry.jlpt.length ? entry.jlpt[0].replace("-", " ") : null,
         wanikaniLevel: entry.tags.length ? ("wanikani level " + entry.tags[0].split("wanikani")[1]) : null
      });
   }
   
   return {
      entries: entries,
      count: content.length,
      isLastPage: content.length < 20
   }
}

function parseFurigana(node) {
   let result = node.japanese[0].reading;
   return result;
}

function parseChars(node) {
   // console.log("chars", node.text);
   return decodeURIComponent(node.japanese[0].word || node.japanese[0].reading).trim();
}

function parseDefs(node) {
   const defs = node.senses;
   let result = [];

   function getType(tag) {
      if(tag?.[0]?.[0] === "W") {
         return Constants.WIKIPEDIA_DEF;
      }
      return Constants.DEFAULT_DEF;
   } 

   for(let d of defs) {
      result.push({
         type: getType(d.parts_of_speech[0]),
         tag:  d.parts_of_speech.join(", "),
         data: [d.english_definitions.join("; "), ...d.tags, ...d.info],
         link: d.links[0]
      });
   }
   if(node.japanese.length > 1) {
      result.push({
         type: Constants.OTHERS_DEF,
         tag: "Other forms",
         data: node.japanese.slice(1).map(form => (form.word ?? "") + "【" + form.reading + "】")
      });
   }
   return result;
}

export function parseWikipediaDef(rawHTML) {
   const root = parse(rawHTML);
   const abstract = root.querySelector(".meaning-abstract");
   const result = [abstract.childNodes[0].textContent];
   for(let i = 2; i < abstract.childNodes.length; i+=2) {
      result.push(<br key={ i-1 }></br>);
      result.push(<a href={ abstract.childNodes[i].attributes.href } key={ i } target="_blank" rel="noopener noreferrer">{ abstract.childNodes[i].textContent } </a>)
   }

   return result;
}