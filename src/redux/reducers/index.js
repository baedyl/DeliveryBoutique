import { act } from 'react-test-renderer'
import { combineReducers } from 'redux'
import { auth } from '../../Core/onboarding/redux/auth'
import {SET_BOUTIQUE, SET_ORDER, SET_CLIENT} from '../actions';

const LOG_OUT = 'LOG_OUT'

const initialSate = {
  boutique: null,
  order: null,
  clientorder: null,
};

// combine reducers to build the state
const appReducer = combineReducers({ auth })

const rootReducer = (state, action) => {
  if (action.type === LOG_OUT) {
    state = undefined
  }

  return appReducer(state, action)
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

export function clientReducer(state = initialSate, action) {
  switch (action.type) {
    case SET_CLIENT:
      return {...state, clientorder: action.payload};
    default:
      return state;
  }
}

export default rootReducer