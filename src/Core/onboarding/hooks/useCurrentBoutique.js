import { useSelector } from 'react-redux'

export default useCurrentBoutique = () => useSelector(state => state.auth.boutique)
