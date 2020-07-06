import React from 'react';

import {baseComponent} from '../components/hof/base'

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    console.log('Demo componentDidMount');
    console.log(this.props);
    console.log('Demo end componentDidMount');
  }

  render() {
    console.log('Demo render');
    console.log(this.props);
    console.log('Demo end render');
    return (
      <div>
        dems
      </div>
    );
  }
}

export default baseComponent(Demo);