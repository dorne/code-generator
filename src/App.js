import React from 'react';
import './App.css';
import { Button, Tooltip, Tag } from 'antd';

class App extends React.Component {
  handleClick(e) {
    /*global dorne_code_gen*/
    /*eslint no-undef: "error"*/
    const electron = dorne_code_gen.electron;
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

      // window.dorne_code_gen['sqlite'].a();
      const { dialog } = remote;
      //remote.getCurrentWindow().setSize(2000, 1000);
      const webContents = remote.getCurrentWindow().webContents;
      //webContents.isDevToolsOpened() ? webContents.closeDevTools() : webContents.openDevTools();
      dialog.showErrorBox('提示', '支持electron');
    } else {
      alert('不支持electron');
    }
  }

  tplClick(e) {
    var source = dorne_code_gen.fs.readFileSync(
      dorne_code_gen.templatePath('test/test.art'),
      'utf8',
    );

    var html = dorne_code_gen.artTemplate().render(source, {
      user: {
        name: 'admin_user_order_gift',
      },
    });

    console.log(html);
  }

  async sqlClick(e) {
    let uri = '';
    let database = 'sqlite';
    let tableName = 'item';

    let db = window.dorne_code_gen.db(database);
    let test = await db.testConnection(uri);
    if (test == null) {
      console.log('连接成功');
    } else {
      console.log('连接失败: ' + test);
    }

    let tables = await db.getTables(uri);
    console.log(tables);
    let columns = await db.getColumns(uri, tableName);
    console.log(columns);

    // let db = window.dorne_code_gen.db('sqlite');
    // let test = await db.testConnection(uri);
    // if (test == null) {
    //   alert('连接成功');
    // } else {
    //   alert('连接失败: ' + test);
    // }

    // let tables = await db.getTables(uri);
    // console.log(tables);
    // let columns = await db.getColumns(uri, 'item');
    // console.log(columns);
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

        <Tooltip title="search">
          <Button type="primary" onClick={this.tplClick}>
            模版
          </Button>
        </Tooltip>
      </div>
    );
  }
}

export default App;
