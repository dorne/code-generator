import React from 'react';

import {Base, connect} from '../components/hof/base'
import { NavLink, Route, Switch, withRouter } from 'react-router-dom';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log('Settings componentDidMount');
    console.log(this.props);
    console.log('Settings end componentDidMount');
  }

  render() {
    console.log('Settings render');
    console.log(this.props);
    console.log('Settings end render');
    return (
      <div>
        设置
      </div>
    );
  }
}

export default connect(Base(withRouter(Settings)));
