// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, globalShortcut } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

//修复 electron v9
//Error: Loading non-context-aware native module in renderer
//Requiring Native Modules in the Renderer Process to be NAPI or Context Aware #18397
app.allowRendererProcessReuse = false;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
  //解决 Electron 在 mac 上复制粘贴失效
  if (process.platform === 'darwin') {
    const template = [
      {
        label: 'Application',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Command+Q',
            click: function () {
              app.quit();
            },
          },
        ],
      },
      {
        label: 'Edit',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
        ],
      },
      {
        label: 'Selection',
        submenu: [
          { label: 'Copy', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' },
        ],
      },
    ];
    Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  } else {
    Menu.setApplicationMenu(null);
  }

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    minWidth: 1000,
    minHeight: 800,
    // autoHideMenuBar: true,
    // allowRunningInsecureContent: true,
    // experimentalCanvasFeatures: true,
    // useContentSize: true,
    // titleBarStyle: 'hidden',
    // frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev ? true : false,
    },
  });

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`,
  );

  // Open the DevTools.
  if (isDev) mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  // mainWindow.on('resize', function (e) {
  //   console.log(mainWindow.getContentBounds());
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

//electron在mac电脑上复制粘贴全选失效
app.on('browser-window-focus', () => {
  if (!mainWindow) return;

  if (process.platform === 'darwin') {
    let contents = mainWindow.webContents;

    globalShortcut.register('CommandOrControl+C', () => {
      contents.copy();
    });

    globalShortcut.register('CommandOrControl+V', () => {
      contents.paste();
    });

    globalShortcut.register('CommandOrControl+X', () => {
      contents.cut();
    });

    globalShortcut.register('CommandOrControl+A', () => {
      contents.selectAll();
    });
  }
});

app.on('browser-window-blur', () => {
  globalShortcut.unregisterAll();
});
