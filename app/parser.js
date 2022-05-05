import { parse } from "node-html-parser";

function getObjectsFromHTML(rawHTML) {
   const root = parse(rawHTML);
   const result = [];
   root.set_content(root.querySelector("#primary"));
   let content = root.querySelectorAll("[class='concept_light clearfix']");
   console.log(content);
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
   console.log("chars", node.text);
   return node.text.trim();
}

function parseDefs(nodes) {
   let result = [];
   let tags = nodes.querySelectorAll(".meaning-tags");
   let defs = nodes.querySelectorAll(".meaning-meaning");
   for(let i = 0; i < tags.length; ++i) {
      result.push({
         "tag": tags[i].text, 
         "text": defs[i].text
      });
   }
   // console.log(result);
   return result;
}

export default getObjectsFromHTML;