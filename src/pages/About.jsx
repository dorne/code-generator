import React from 'react';

import {baseComponent} from '../components/hof/base'
import conf from '../../package.json'

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('About componentDidMount');
    console.log(this.props);
    console.log('About end componentDidMount');
  }

  render() {
    console.log('About render');
    console.log(this.props);
    console.log('About end render');
    return (
      <div>
        版本:{conf.version}
      </div>
    );
  }
}

export default baseComponent(About);