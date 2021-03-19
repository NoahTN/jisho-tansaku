export var jiframe;
export var displaying = false;

export function insert() {
   jiframe = document.createElement("iframe");
   jiframe.id = "jiframe";
   jiframe.frameborder = 0;
   jiframe.setAttribute("style", `
      position: absolute;
      display: none;
      top: ${document.documentElement.scrollTop + 250}px;
      left: 50%;
      margin-left: -325px;
      z-index: 99999;
      width: 650px;
      height: 500px;
      box-shadow: 0px 0px 5px;
      border-radius: 5px;
   `);
   document.body.appendChild(jiframe);
}

export function display(text) {
   try {
      jiframe.src = "https://jisho.org/search/"+text;
      jiframe.style.display = "block";
      displaying = true;
   }
   catch(error) {
      console.error(error);
   }
}

export function hide() {
   jiframe.style.display = "none";
   displaying = false;
}

