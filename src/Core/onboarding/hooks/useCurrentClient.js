import { useSelector } from 'react-redux'

export default useCurrentClient = () => useSelector(state => state.auth.clientorder)
