import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

import { BrowserRouter as Router } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import rootReducers from './reducers';
import {logger} from 'redux-logger'

const store = createStore(rootReducers,{},applyMiddleware(logger));

//store.subscribe(() => console.log('state:', store.getState()));

const render = () => {
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ConfigProvider>,
    document.getElementById('root'),
  );
};

render();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
