import React from 'react';

import {baseComponent} from '../components/hof/base'
import conf from '../../package.json'

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      html: `<p>
        <ul>
          <li>1</li>
          <li>2</li>
          <li>3</li>
        </ul>
      </p>`
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
      <div dangerouslySetInnerHTML={{
        __html: this.state.html
      }}/>
    );
  }
}

export default baseComponent(About);