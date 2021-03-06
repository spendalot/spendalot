// @ts-check

import {
  UPDATE_PAGE, UPDATE_OFFLINE, OPEN_SNACKBAR, CLOSE_SNACKBAR,
} from '../actions/app.js';

export const app = (
  state = { drawerOpened: false },
  action
) => {
  console.debug('reducers/app.js', state, action);
    
  switch(action.type) {
    case UPDATE_PAGE: {
      return {
        ...state,
        page: action.page,
      };
    }
    case UPDATE_OFFLINE: {
      return {
        ...state,
        offline: action.offline,
      };
    }
    case OPEN_SNACKBAR: {
      return {
        ...state,
        snackbarOpened: true,
      };
    }
    case CLOSE_SNACKBAR: {
      return {
        ...state,
        snackbarOpened: false,
      };
    }
    default:
      return state;
  }
};

export default app;