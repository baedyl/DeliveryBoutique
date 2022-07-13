import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslations } from 'dopenative'
import { HomeScreen, RestaurantScreen, ItemDetails, CartScreen, OrderScreen, UpdateProfile, OrderDelivery } from '../screens'
import Tabs from '../navigation/tabs'

const MainStack = createStackNavigator()
// const TabStack = createBottomTabNavigator()

const MainStackNavigator = () => {
  const { localized } = useTranslations()
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitleVisible: false,
        headerBackTitle: localized('Back'),
      }}
      initialRouteName="Home">
      <MainStack.Screen name="Home" component={Tabs} />
      <MainStack.Screen name="Restaurant" component={RestaurantScreen} options={{headerShown: false}} />
      <MainStack.Screen name="ItemDetails" component={ItemDetails} />
      <MainStack.Screen name="Cart" component={CartScreen} />
      <MainStack.Screen name="Order" component={OrderScreen} />
      <MainStack.Screen name="OrderDelivery" component={OrderDelivery} />
      <MainStack.Screen name="UpdateProfile" component={UpdateProfile} />
    </MainStack.Navigator>
  )
}

export default MainStackNavigator
