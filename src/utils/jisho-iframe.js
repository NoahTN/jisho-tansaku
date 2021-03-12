export const searchAndDisplay = (text) => {
   const jiframe = document.createElement("iframe");
   jiframe.id = "jisho-iframe";
   jiframe.src = "https://jisho.org/search/"+text;
   jiframe.setAttribute("style", `
      position: absolute;
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

