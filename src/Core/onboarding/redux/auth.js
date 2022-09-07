const UPDATE_USER = 'UPDATE_USER'
const UPDATE_CLIENT = 'UPDATE_CLIENT'
const UPDATE_ORDER = 'UPDATE_ORDER'
const UPDATE_BOUTIQUE = 'UPDATE_BOUTIQUE'
const LOG_OUT = 'LOG_OUT'

export const DUMMY_USER_DATA = {}

export const setUserData = data => ({
  type: UPDATE_USER,
  data,
})

export const setClientData = data => ({
  type: UPDATE_CLIENT,
  data,
})

export const setOrderData = data => ({
  type: UPDATE_ORDER,
  data,
})

export const setBoutiqueData = data => ({
  type: UPDATE_BOUTIQUE,
  data,
})

export const logout = () => ({
  type: LOG_OUT,
})

const initialState = {
  user: DUMMY_USER_DATA,
  order: {},
  boutique: {},
  clientorder: {},
}

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      }
    case UPDATE_CLIENT:
      return {
        ...state,
        clientorder: action.data.clientorder,
      }
    case LOG_OUT: {
      return initialState
    }
    case UPDATE_ORDER:
      return {
        ...state,
        order: action.data.order,
      }
    case UPDATE_BOUTIQUE:
      return {
        ...state,
        order: action.data.boutique,
      }
    default:
      return state
  }
}
