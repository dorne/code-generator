import * as actionType from '../constants/redux';

const location = (state = {}, action) => {
  switch (action.type) {
    case actionType.ADD:
      state = action.math;
      return state;
    default:
      return state;
  }
};

export default location;
