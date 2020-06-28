// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});

// 暴露electron
global.dorne_code_gen = {
  process_versions: process.versions,
  electron: require('electron'),
  template: require('art-template'),
  sqlite: {
    a: function () {
      alert('sqlite a');
    },
    b: function () {
      alert('sqlite b');
    },
  },
  mysql: {
    a: function () {
      alert('mysql a');
    },
    b: function () {
      alert('mysql b');
    },
  },
};
