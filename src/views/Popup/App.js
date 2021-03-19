import React from 'react'
import './App.css'

function App() {
  let _searchText = "";

  function handleChange(event) {
    _searchText = event.target.value;
  } 

  function handleSubmit() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, _searchText);
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Search Jisho</p>
        <form onSubmit={handleSubmit}>
          <input type="text" name="jt-popup" onChange={handleChange}/>
          <input type="submit" value="Search"/>
        </form>
      </header>
    </div>
  );
}

export default App
