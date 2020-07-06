import React from 'react';

import {HOC, connect} from '../components/tools'

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
        about {this.state.abouut}
      </div>
    );
  }
}

export default connect(HOC(About));