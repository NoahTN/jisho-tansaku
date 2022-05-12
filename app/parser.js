import { parse } from "node-html-parser";
import Constants from "./constants";

function getObjectsFromHTML(rawHTML) {
   const root = parse(rawHTML);
   const result = [];
   root.set_content(root.querySelector("#primary"));
   let content = root.querySelectorAll("[class='concept_light clearfix']");
   // console.log(content);
   for(const entry of content) {
      result.push({
         furigana: parseFurigana(entry.querySelector(".furigana")),
         chars: parseChars(entry.querySelector(".text")),
         defs: parseDefs(entry.querySelector(".meanings-wrapper"))
      });  
   }
   return result;
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
   return node.text.trim();
}

function parseDefs(nodes) {
   let result = [];
   let tags = nodes.querySelectorAll(".meaning-tags");
   let defs = nodes.querySelectorAll(".meaning-wrapper");
 
   const formatDef = (index) => {
      let tag = tags[index].text;
      let result = {
         "type": null,
         "tag" : tag,
         "data" : []
      }
      if(tag[0] === "W") {
         result.type = Constants.WIKIPEDIA_DEF;
         result.data.push(defs[index].querySelector(".meaning-meaning").text);
         const abstract = defs[index].querySelector(".meaning-abstract");
         if(abstract) {
            result.data.push(abstract.text);
         }
      }
      else if(tag[0] === "O") {
         result.type = Constants.OTHERS_DEF;
         for(let form of defs[index].querySelectorAll(".meaning-meaning > span")) {
            result.data.push(form.text);
         }
      }
      else if(tag === "Notes") {
         result.type = Constants.NOTES_DEF;
         result.data.push(nodes.querySelector(".meaning-representation_notes").text);
      }
      else {
         result.type = Constants.DEFAULT_DEF;
         result.data.push(defs[index].querySelector(".meaning-meaning").text);
         const suppInfo = defs[index].querySelector(".supplemental_info");
         if(suppInfo)
            result.data.push(suppInfo.text);
      }
      return result;
   }

   for(let i = 0; i < tags.length; ++i) {
      result.push(formatDef(i));
   }

   // console.log(result);
   return result;
}

export default getObjectsFromHTML;