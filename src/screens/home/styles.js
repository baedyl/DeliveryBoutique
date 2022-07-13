import { StyleSheet } from 'react-native'
import { SIZES, COLORS } from '../../constants'

const dynamicStyles = (theme, appearance) => {
  const colorSet = theme.colors[appearance]

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.lightGray4,
    },
    shadow: {
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    restaurantItem: {
      marginBottom: 0,
      padding: 0,
    },
    categoriesContainer: {
      borderStyle: "solid",
    },
    logo: {
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: -50,
      flex: 1,
    },
    logoImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
      tintColor: colorSet.primaryForeground,
    },
  })
}

export default dynamicStyles
