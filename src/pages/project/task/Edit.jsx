import React from 'react';

import {baseComponent} from '../../../components/hof/base'

class Edit extends React.Component {
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
    console.log('task render');
    console.log(this.props);
    console.log('task end render');
    return (
      <div>
          task add
      </div>
    );
  }
}

export default baseComponent(Edit);