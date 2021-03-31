export var jiframe;
export var displaying = false;

export function insert(width, height) {
   jiframe = document.createElement("iframe");
   jiframe.id = "jiframe";
   jiframe.frameborder = 0;
   jiframe.setAttribute("style", `
      position: absolute;
      display: none;
      top: ${document.documentElement.scrollTop}px;
      margin-top: ${(document.documentElement.clientHeight-height)/2}px;
      left: 50%;
      margin-left: ${width/2}px;
      z-index: 99999;
      width: ${width};
      height: ${height};
      box-shadow: 0px 0px 5px;
      border-radius: 5px;
   `);
   document.body.appendChild(jiframe);
}

export function search(text) {
   try {
      jiframe.src = "https://jisho.org/search/"+text;
   }
   catch(error) {
      console.error(error);
   }
}

export function display() {
   jiframe.style.display = "block";
   jiframe.style.top = document.documentElement.scrollTop + "px";
   displaying = true;
}

export function hide() {
   jiframe.style.display = "none";
   displaying = false;
}

export function resizeWidth(width) {
   chrome.storage.local.set({width: width});
   jiframe.style.width = parseInt(width) + "px";
   jiframe.style.marginLeft = -(width/2) + "px";
}

export function resizeHeight(height) {
   chrome.storage.local.set({height: height});
   jiframe.style.height = parseInt(height) + "px";
   jiframe.style.top = document.documentElement.scrollTop + "px";
   jiframe.style.marginTop = (document.documentElement.clientHeight-height)/2 + "px";
}
