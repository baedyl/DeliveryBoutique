import {SET_USER, SET_BOUTIQUE, SET_ORDER} from './actions';

const initialSate = {
  user: null,
  boutique: null,
  order: null,
};

export function userReducer(state = initialSate, action) {
  switch (action.type) {
    case SET_USER:
      return {...state, user: action.payload};
    default:
      return state;
  }
}

export function boutiqueReducer(state = initialSate, action) {
  switch (action.type) {
    case SET_BOUTIQUE:
      return {...state, boutique: action.payload};
    default:
      return state;
  }
}

export function orderReducer(state = initialSate, action) {
  switch (action.type) {
    case SET_ORDER:
      return {...state, order: action.payload};
    default:
      return state;
  }
}

export default userReducer;
