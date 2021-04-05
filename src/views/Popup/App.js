import React from 'react'
import './App.css'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: "",
      width: 650,
      height: 500
    }
  }

  componentDidMount() {
    chrome.storage.local.get(["width", "height"], (data) => {
      this.setState({
        width: data.width,
        height: data.height
      });
    });
  }

  handleTextChange = (event) => {
    this.setState({ searchText: event.target.value });
  }

  handleWidthChange = (event) => {
    this.setState({ width: event.target.value });
    this._sendMessage("resz-w", event.target.value);
  } 

  handleHeightChange = (event) => {
    this.setState({ height: event.target.value });
    this._sendMessage("resz-h", event.target.value);
  }  

  handleSubmit = (event) => {
    event.preventDefault();
    this._sendMessage("search", this.state.searchText);
  }

  _sendMessage(type, data) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {type: type, data: data});
    });
  }

  resetWidth = () => {
    this.setState({ width: 650 });
    this._sendMessage("resz-w", 650);
  }

  resetHeight = () => {
    this.setState({ height: 500 });
    this._sendMessage("resz-h", 500);
  }

  render() {
    return (
      <div className="App">
        <h3>Jisho Tansaku</h3>
        <form onSubmit={this.handleSubmit}>
          <input autoFocus type="text" name="tansaku" className="search-inp" maxLength = "42" onChange={this.handleTextChange}/>
          <input type="submit" className="search-btt" value="🔍︎"/>
        </form>
        <br/>
        <label>Width</label>
        <div className="dimen-input">
          <input type="number" min={0} value={this.state.width} onChange={this.handleWidthChange}/>
          <button onClick={this.resetWidth}>R</button>
        </div>
        <label>Height</label>
        <div className="dimen-input">
          <input type="number" min={0} value={this.state.height} onChange={this.handleHeightChange}/>
          <button onClick={this.resetHeight}>R</button>
        </div>
      </div>
    );
  };
}

export default App;
