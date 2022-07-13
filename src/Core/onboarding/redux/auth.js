const UPDATE_USER = 'UPDATE_USER'
const UPDATE_ORDER = 'UPDATE_ORDER'
const LOG_OUT = 'LOG_OUT'

export const DUMMY_USER_DATA = {}

export const setUserData = data => ({
  type: UPDATE_USER,
  data,
})

export const setOrderData = data => ({
  type: UPDATE_ORDER,
  data,
})

export const logout = () => ({
  type: LOG_OUT,
})

const initialState = {
  user: DUMMY_USER_DATA,
  order: {},
}

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      }
    case LOG_OUT: {
      return initialState
    }
    case UPDATE_ORDER: 
      return {
        ...state,
        order: action.data.order
      }
    default:
      return state
  }
}
