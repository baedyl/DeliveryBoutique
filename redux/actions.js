export const SET_USER = 'SET_USER';
export const SET_ORDER = 'SET_ORDER';
export const SET_BOUTIQUE = 'SET_BOUTIQUE';

export const setUser = user => dispatch => {
  dispatch({
    type: SET_USER,
    payload: user,
  });
};

export const setOrder = order => dispatch => {
  dispatch({
    type: SET_ORDER,
    payload: order,
  });
};

export const setBoutique = boutique => dispatch => {
  dispatch({
    type: SET_BOUTIQUE,
    payload: boutique,
  });
};
