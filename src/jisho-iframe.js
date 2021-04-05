export var jiframe;
export var displaying = false;

export function insert(width, height) {
   jiframe = document.createElement("iframe");
   jiframe.id = "jiframe";
   jiframe.frameborder = 0;
   jiframe.setAttribute("style", `
      position: absolute;
      display: none;
      margin-top: -${height/2}px;
      left: 50%;
      margin-left: -${width/2}px;
      z-index: 99999;
      width: ${width}px;
      height: ${height}px;
      box-shadow: 0px 0px 5px;
      border-radius: 5px;
   `);
   document.body.appendChild(jiframe);
}

export function search(text) {
   // CORS Error without a proxy
   try {
      jiframe.src = "https://jisho.org/search/"+text;
   }
   catch(error) {
      console.error(error);
   }
}

export function display() {
   jiframe.style.display = "block";
   jiframe.style.top = (document.documentElement.scrollTop + document.documentElement.clientHeight/2) + "px";
   displaying = true;
}

export function hide() {
   jiframe.style.display = "none";
   displaying = false;
}

export function resizeWidth(width) {
   chrome.storage.local.set({ width: width });
   jiframe.style.width = parseInt(width) + "px";
   jiframe.style.marginLeft = -(width/2) + "px";
}

export function resizeHeight(height) {
   chrome.storage.local.set({ height: height });
   jiframe.style.height = parseInt(height) + "px";
   jiframe.style.marginTop = -(height/2) + "px";
}
