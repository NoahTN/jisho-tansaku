import React from 'react';
import './App.css'

function App() {
   let searchText = "";
   let width = 650;
   let height = 500;
   
   chrome.storage.local.get(["width", "height"], (data) => {
      width = data.width;
      height = data.height;
   });

   function sendMessage(type, data) {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) {
         chrome.tabs.sendMessage(tabs[0].id, { type: type, data: data });
      });
   }

   return (
      <div className="App">
         <h3>Jisho Tansaku</h3>
         <form onSubmit={e => {
            e.preventDefault() 
            sendMessage(searchText, "search")
         }}>
            <input autoFocus type="text" name="tansaku" className="search-inp" maxLength="42" onChange={e => searchText = e.target.value}/>
            <input type="submit" className="search-btt" value="🔍︎" />
         </form>
         <br />
         <label>Width</label>
         <div className="dimen-input">
            <input type="number" min={0} defaultValue={width} onChange={e => sendMessage("resz-w", e.target.value)} />
            <button onClick={() => sendMessage("resz-w", 650)}>R</button>
         </div>
         <label>Height</label>
         <div className="dimen-input">
            <input type="number" min={0} defaultValue={height} onChange={e => sendMessage("resz-h", e.target.value)} />
            <button onClick={() => sendMessage("resz-h", 500)}>R</button>
         </div>
      </div>
   );
}

export default App;