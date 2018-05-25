// @ts-check

import {
  UPDATE_PAGE,
} from '../actions/app.js';

export const app = (
  state = { drawerOpened: false },
  action
) => {
  switch(action.type) {
    case UPDATE_PAGE: {
      return {
        ...state,
        page: action.page,
      };
    }
    default:
      return state;
  }
};

export default app;