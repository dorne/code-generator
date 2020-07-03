import React from 'react';

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    console.log('Settings');
    console.log(props);
    console.log('Settings End');
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        设置
      </div>
    );
  }
}

export default Settings;
