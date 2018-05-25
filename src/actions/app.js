// @ts-check

export const UPDATE_PAGE = 'UPDATE_PAGE';

function loadPage(page) {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_PAGE,
      page,
    });
  };
}