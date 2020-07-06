import * as actionType from '../constants/redux';

const routes = (state = {}, action) => {
  switch (action.type) {
    case actionType.ROUTES_ADD:
      return action.routes;
    default:
      return state;
  }
};

export default routes;