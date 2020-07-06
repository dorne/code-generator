import React from 'react';

import { baseComponent } from '../../components/hof/base';

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
  }

  render() {
   
    return (
      <div>
       project edit
      </div>
    );
  }
}

export default baseComponent(Edit);
