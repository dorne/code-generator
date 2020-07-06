import * as actionType from '../constants/redux';

const match = (state = {}, action) => {
  switch (action.type) {
    case actionType.MATCH_ADD:
      return action.match;
    default:
      return state;
  }
};

export default match;