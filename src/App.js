import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {
  handleClick(e) {
    //alert('click');
    if (window.electron) {
      const { dialog } = window.electron.remote;
      window.electron.remote.getCurrentWindow().setSize(2000, 1000)
      dialog.showErrorBox('提示', '支持electron');
    }else{
      alert('不支持electron');
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <p>
            <button onClick={this.handleClick}>btn</button>
            We are using Node.js
            <span id="node-version"></span>, Chromium <span id="chrome-version"></span>, and
            Electron <span id="electron-version"></span>.
          </p>
        </header>
      </div>
    );
  }
}

export default App;
