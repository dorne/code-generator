import React from 'react';
import './App.css';
import { Button, Tooltip, Tag } from 'antd';

class App extends React.Component {
  handleClick(e) {
    //alert('click');
    const electron = window.dorne_code_gen.electron;
    const remote = electron.remote;
    const app = remote.app;

    if (electron) {
      //常用地址
      console.log(app.getPath('home'));
      console.log(app.getPath('appData'));
      console.log(app.getPath('userData'));
      console.log(app.getPath('exe'));
      console.log(app.getPath('module'));
      console.log(app.getPath('temp'));

      window.dorne_code_gen['sqlite'].a();
      const { dialog } = remote;
      remote.getCurrentWindow().setSize(2000, 1000);
      const webContents = remote.getCurrentWindow().webContents;
      webContents.isDevToolsOpened() ? webContents.closeDevTools() : webContents.openDevTools();
      dialog.showErrorBox('提示', '支持electron');
    } else {
      alert('不支持electron');
    }
  }

  async sqlClick(e) {
    let db = window.dorne_code_gen.db('mysql');
    let test = await db.testConnection();
    if (test == null) {
      alert('连接成功');
    } else {
      alert('连接失败: '+test);
    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <Tag id="node-version" color="#f50"></Tag>
          <Tag id="chrome-version" color="#2db7f5"></Tag>
          <Tag id="electron-version" color="#87d068"></Tag>
        </div>

        <Tooltip title="search">
          <Button type="primary" onClick={this.handleClick}>
            electron 常用
          </Button>
        </Tooltip>

        <Tooltip title="search">
          <Button type="primary">模版引擎</Button>
        </Tooltip>

        <Tooltip title="search">
          <Button type="primary" onClick={this.sqlClick}>
            数据库
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default App;
