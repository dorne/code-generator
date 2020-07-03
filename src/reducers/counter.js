import * as actionType from '../constants/redux'

const counter = (state = 0, action) => {
  switch (action.type) {
    case actionType.INCREMENT:
      return state + action.num;
    case actionType.DECREMENT:
      return state - action.num;
    default:
      return state;
  }
};

export default counter;
