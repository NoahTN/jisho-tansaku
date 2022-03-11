import React from 'react';
import './App.css'

function App() {
   // const [searchText, setSearchText] = React.useState("");
   const [width, setWidth] = React.useState(650);
   const [height, setHeight] = React.useState(500);

   React.useEffect(() => {
      chrome.storage.local.get(["width", "height"], (data) => {
         setWidth(data.width);
         setHeight(data.height);
      });
   });

   // handleTextChange = (event) => {
   //    this.setState({ searchText: event.target.value });
   // }

   // handleWidthChange = (event) => {
   //    this.setState({ width: event.target.value });
   //    this._sendMessage("resz-w", event.target.value);
   // }

   // handleHeightChange = (event) => {
   //    this.setState({ height: event.target.value });
   //    this._sendMessage("resz-h", event.target.value);
   // }

   // handleSubmit = (event) => {
   //    event.preventDefault();
   //    this._sendMessage("search", this.state.searchText);
   // }

   function executeAndSendMessage(callback, data, type) {
      callback(data);
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { type: type, data: data });
      });
   }

   return (
      <div className="App">
         <h3>Jisho Tansaku</h3>
         <form onSubmit={e => {
            e.preventDefault() 
            executeAndSendMessage({}, e.target.value, "search")
         }}>
            <input autoFocus type="text" name="tansaku" className="search-inp" maxLength="42"/>
            <input type="submit" className="search-btt" value="🔍︎" />
         </form>
         <br />
         <label>Width</label>
         <div className="dimen-input">
            <input type="number" min={0} value={width} onChange={e => executeAndSendMessage(setWidth, e.target.value, "resz-w")} />
            <button onClick={() => executeAndSendMessage(setWidth, 650, "resz-w")}>R</button>
         </div>
         <label>Height</label>
         <div className="dimen-input">
            <input type="number" min={0} value={height} onChange={e => executeAndSendMessage(setHeight, e.target.value, "resz-h")} />
            <button onClick={() => executeAndSendMessage(setHeight, 500, "resz-h")}>R</button>
         </div>
      </div>
   );
}

export default App;