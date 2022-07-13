import { useSelector } from 'react-redux'

export default useCurrentOrder = () => useSelector(state => state.auth.order)
