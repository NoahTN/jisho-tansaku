import React from 'react'
import './App.css'

function App() {
  let _searchText = "";
  let width = 650;
  let height = 500;
  chrome.storage.sync.get(["width", "height"], function(data) {
    width = data.width;
    height = data.height;
  });

  function handleTextChange(event) {
    _searchText = event.target.value;
  }

  function handleWidthChange(event) {
    chrome.storage.sync.set({width: event.target.value});
    _sendMessage("resz-w", event.target.value);
  } 

  function handleHeightChange(event) {
    chrome.storage.sync.set({height: event.target.value});
    _sendMessage("resz-h", event.target.value);
  }  

  function handleSubmit() {
    _sendMessage("search", _searchText);
  }

  function _sendMessage(type, data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: type, data: data});
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Search Jisho</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="jt-popup" onChange={handleTextChange}/>
          <input type="submit" value="Search"/>
        </form>
        <br/>
        <label>Width</label>
        <input type="number" min={0} defaultValue={width} onChange={handleWidthChange}/>
        <label>Height</label>
        <input type="number" min={0} defaultValue={height} onChange={handleHeightChange}/>
      </header>
    </div>
  );
}

export default App
