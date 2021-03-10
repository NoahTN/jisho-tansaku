import ReactDOM from 'react-dom';

// Need to set limits
export const searchAndLoad = (text) => {
   ReactDOM.render(
      <iframe
         className="jisho-iframe"
         src={"https://jisho.org/search/"+text}
      />,
      document.body.appendChild(document.createElement("div"))
   );
}


