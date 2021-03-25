import React from 'react'
import './App.css'

function App() {
  let _searchText = "";
  let width = 650;
  let height = 500;
  // remember width/ height setting and access

  function handleTextChange(event) {
    _searchText = event.target.value;
  }

  function handleWidthChange(event) {
    width = event.target.value;
  } 

  function handleHeightChange(event) {
    height = event.target.value;
  }  

  function handleSubmit() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: "search", data: _searchText});
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
        <input type="number" value="width" onChange={handleWidthChange}/>
        <input type="number" value="height" onChange={handleHeightChange}/>
      </header>
    </div>
  );
}

export default App
