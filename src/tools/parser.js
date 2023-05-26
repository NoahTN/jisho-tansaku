import { parse } from "node-html-parser";
import Constants from "./constants";

export function getObjectsFromJSON(json) {
   const content = json.data;
   const entries = [];
   for(const entry of content) {
      entries.push({
         furigana: entry.japanese[0].reading,
         chars: parseChars(entry),
         defs: parseDefs(entry.senses)
      });
   }

   return {
      entries: entries,
      isLastPage: content.length < 20
   }
}

export function getObjectsFromHTML(rawHTML) {
   const root = parse(rawHTML);
   const entries = [];
   const countText = root.querySelector(".result_count")?.text;
   const content = root.querySelectorAll("[class='concept_light clearfix']");
   const isLastPage = !root.querySelector(".more");
   // console.log(content);
   for(const entry of content) {
      entries.push({
         furigana: parseFurigana(entry.querySelector(".furigana")),
         chars: parseChars(entry.querySelector(".text")),
         defs: parseDefs(entry.querySelector(".meanings-wrapper")),
      });  
   }
   return {
      entries: entries, 
      countText: countText, 
      isLastPage: isLastPage
   };
}

function parseFurigana(nodes) {
   let result = [];
   for(const furi of nodes.getElementsByTagName("span")) {
      result.push(furi.text);
   }
   // console.log("furigana", result);
   return result;
}

function parseChars(node) {
   // console.log("chars", node.text);
   return decodeURIComponent(node.slug).trim();
}

function parseDefs(defs) {
   let result = [];

   function getType(tag) {
      if(tag[0][0] === "W") {
         return Constants.WIKIPEDIA_DEF;
      }
      return Constants.DEFAULT_DEF;
   } 

   for(let d of defs) {
      const tag = d.parts_of_speech;
      result.push({
         type: getType(tag),
         tag:  tag,
         data: [d.english_definitions.join("; "), ...d.tags],
         link: d.links[0]
      });
   }
   return result;
   // let tags = nodes.querySelectorAll(".meaning-tags");
   // let defs = nodes.querySelectorAll(".meaning-wrapper");
 
   // const formatDef = (index) => {
   //    let tag = tags[index].text;
   //    let result = {
   //       "type": null,
   //       "tag" : tag,
   //       "data" : []
   //    }
   //    if(tag[0] === "W") {
   //       result.type = Constants.WIKIPEDIA_DEF;
   //       result.data.push(defs[index].querySelector(".meaning-meaning").text);
   //       const abstract = defs[index].querySelector(".meaning-abstract");
   //       if(abstract) {
   //          result.data.push([abstract.text, abstract.querySelector("a").attributes.href]);
   //       }
   //    }
   //    else if(tag[0] === "O") {
   //       result.type = Constants.OTHERS_DEF;
   //       for(let form of defs[index].querySelectorAll(".meaning-meaning > span")) {
   //          result.data.push(form.text);
   //       }
   //    }
   //    else if(tag === "Notes") {
   //       result.type = Constants.NOTES_DEF;
   //       result.data.push(nodes.querySelector(".meaning-representation_notes").text);
   //    }
   //    else {
   //       result.type = Constants.DEFAULT_DEF;
   //       result.data.push(defs[index].querySelector(".meaning-meaning").text);
   //       const suppInfo = defs[index].querySelector(".supplemental_info");
   //       if(suppInfo)
   //          result.data.push(suppInfo.text);
   //    }
   //    return result;
   // }

   // for(let i = 0; i < tags.length; ++i) {
   //    result.push(formatDef(i));
   // }

   // // console.log(result);
   // return result;
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