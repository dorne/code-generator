import * as actionType from '../constants/redux';

const breadcrumb = (state = [], action) => {
  switch (action.type) {
    case actionType.BREADCRUMB_ADD:
      return action.breadcrumb;
    default:
      return state;
  }
};

export default breadcrumb;
