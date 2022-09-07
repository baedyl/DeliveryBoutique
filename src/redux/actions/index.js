export const SET_ORDER = 'SET_ORDER';
export const SET_CLIENT = 'SET_CLIENT';
export const SET_BOUTIQUE = 'SET_BOUTIQUE';

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

export const setClientOrder = clientorder => dispatch => {
  dispatch({
    type: SET_CLIENT,
    payload: clientorder,
  });
};
