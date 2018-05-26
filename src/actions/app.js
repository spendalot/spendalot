// @ts-check

export const UPDATE_PAGE = 'UPDATE_PAGE';
export const UPDATE_OFFLINE = 'UPDATE_OFFLINE';
export const OPEN_SNACKBAR = 'OPEN_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';

const SNACKBAR_TIMEOUT = 3e3;
let snackbarTimer = null;

function updateState(type, data) {
  return { type, ...data };
}

function loadPage(page) {
  return async (dispatch) => {
    switch (page) {
      case 'page-1': {
        // await import('../components/page-1.js');
        console.debug('lazy-import page-1 here...');
        break;
      }
      default: {
        page = 'view404';
        // await import('../components/my-view404.js');
        console.debug('lazy-import 404 page here...');
        break;
      }
    }

    dispatch(updateState(UPDATE_PAGE, { page }));
  };
}

export function navigate(path) {
  return async (dispatch) => {
    const page = path === '/' ? 'page-1' : path.slice(1);

    dispatch(loadPage(page));
  };
}

function showSnackbar() {
  return async (dispatch) => {
    dispatch(updateState(OPEN_SNACKBAR));
    clearTimeout(snackbarTimer);
    snackbarTimer = window.setTimeout(() => {
      dispatch(updateState(CLOSE_SNACKBAR));
    }, SNACKBAR_TIMEOUT);
  };
}

export function updateOffline(offline) {
  return async (dispatch, getState) => {
    /** NOTE: Show snackbar unless this is first load of the page */
    if (offline !== getState().app.offline) {
      dispatch(showSnackbar());
    }

    dispatch(updateState(UPDATE_OFFLINE, { offline }));
  };
}