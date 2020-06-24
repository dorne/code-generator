import React from 'react';
import './App.css';
import { Button, Tooltip, Tag } from 'antd';

class App extends React.Component {
  handleClick(e) {
    //alert('click');
    const electron = window.dorne_code_gen.electron;
    const remote = electron.remote;
    if (electron) {
      const { dialog } = remote;
      remote.getCurrentWindow().setSize(2000, 1000);
      const webContents = remote.getCurrentWindow().webContents;
      webContents.isDevToolsOpened() ? webContents.closeDevTools() : webContents.openDevTools();
      dialog.showErrorBox('提示', '支持electron');
    } else {
      alert('不支持electron');
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <Tag id="node-version" color="#f50">
          </Tag>
          <Tag id="chrome-version" color="#2db7f5">
          </Tag>
          <Tag id="electron-version" color="#87d068">
          </Tag>
        </div>

        <Tooltip title="search">
          <Button type="primary" onClick={this.handleClick}>
            electron event
          </Button>
        </Tooltip>

        <Tooltip title="search">
          <Button type="primary">Button</Button>
        </Tooltip>
      </div>
    );
  }
}

export default App;
