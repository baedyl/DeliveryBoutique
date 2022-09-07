import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useTranslations } from 'dopenative'
import { HomeScreen, OrderScreen, UpdateProfile } from '../screens'
import Tabs from '../navigation/tabs'

const MainStack = createStackNavigator()
// const TabStack = createBottomTabNavigator()

const MainStackNavigator = () => {
  const { localized } = useTranslations()
  return (
    <MainStack.Navigator
      screenOptions={{
        headerBackTitle: localized('Back'),
        headerShown: false
      }}
      initialRouteName="Home">
      <MainStack.Screen name="Home" component={Tabs} />
      <MainStack.Screen name="Order" component={OrderScreen} />
      <MainStack.Screen name="UpdateProfile" component={UpdateProfile} />
    </MainStack.Navigator>
  )
}

export default MainStackNavigator
