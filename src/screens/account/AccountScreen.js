import React, { memo, useState, useEffect, useCallback } from 'react'
import {
  Alert,
  Text,
  View,
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { Globalstyles } from '../../styles/GlobalStyle'
import { FONTS, SIZES, COLORS, icons, DATABASE_URL } from '../../constants'
import SignUpScreen from '../../Core/onboarding/screens/SignupScreen/SignupScreen'
import { Header, CustomButton } from '../../components'
import { firebase } from '@react-native-firebase/database'
// import { setUser } from '../redux/actions'
import { useDispatch } from 'react-redux'
import { useCurrentUser } from '../../Core/onboarding'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'
import { useTheme } from 'dopenative'

const AccountScreen = memo(props => {
  const { navigation } = props
  const user = useCurrentUser()
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState(null)
  const authManager = useAuth()
  const { theme } = useTheme()

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const currentUser = firebase.auth().currentUser
      console.log('Current User: ', currentUser)
      console.log('-- User: ', user)
      if (currentUser) {
        const userReference = firebase
          .app()
          .database(DATABASE_URL)
          .ref('/Users/' + currentUser.uid)
        userReference.on('value', snapshot => {
          setUserInfo(snapshot.val())
        })
      }
    })

    return unsubscribe
  }, [navigation])

  const onLogout = useCallback(() => {
    try {
      console.log("Logging out...");
      authManager?.logout(user)
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'LoadScreen',
          },
        ],
      })
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  }, [user])

  return (
    <>
      {user ? (
        <SafeAreaView style={Globalstyles.container_1}>
          {/* Header */}
          <Header
            title="Compte"
            icon={theme.icons.logout}
            onPressIcon={onLogout}
          />

          <View style={Globalstyles.container_2}>
            {/* User Photo */}
            {user.profilePictureURL == 'default' ||
            user.profilePictureURL == '' ||
            user.profilePictureURL == undefined ? (
              <View style={styles.image_container}>
                <Image
                  source={icons.user}
                  resizeMode="center"
                  style={{
                    width: '50%',
                    height: '50%',
                  }}
                />
              </View>
            ) : (
              <View style={styles.image_container}>
                <FastImage
                  style={{
                    width: 100,
                    height: 100,
                  }}
                  source={{ uri: user.profilePictureURL }}
                />
              </View>
            )}
            {/* User Name */}
            <Text style={styles.name}>{user.username}</Text>

            {/* Full Name */}
            <View
              style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
              <Image
                source={icons.profile_user}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.black,
                }}
              />
              <Text style={styles.contact_text}> {user.firstName + ' ' + user.lastName}</Text>
            </View>

            {/* Email */}
            <View
              style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
              <Image
                source={icons.email}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.black,
                }}
              />
              <Text style={styles.contact_text}> {user.email}</Text>
            </View>

            {/* Address */}
            <View
              style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
              <Image
                source={icons.home}
                style={{
                  width: 20,
                  height: 20,
                  tintColor: COLORS.black,
                }}
              />
              <Text style={styles.contact_text}> {user.address}</Text>
            </View>

            {/* Phone */}
            <View style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
              <Image
                source={icons.phone}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text style={styles.contact_text}>{user.phone}</Text>
            </View>

            {/* Birthdate */}
            <View style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
              <Image
                source={icons.time}
                style={{
                  width: 25,
                  height: 25,
                }}
              />
              <Text style={styles.contact_text}>{user.birthdate.toDate().toDateString()}</Text>
            </View>

            {/* Update Button */}
            <CustomButton
              text="Modifier Profil"
              onPressButton={() => {
                navigation.navigate('UpdateProfile', { currentUser: user })
              }}
            />
          </View>
        </SafeAreaView>
      ) : (
        //    Sign Up Screen
        <SignUpScreen
          navigation={navigation}
          fromScreen="Account"
          setUserInfo={setUserInfo}
        />
      )}
    </>
  )
})

export default AccountScreen

const styles = StyleSheet.create({
  image_container: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 55,
    marginTop: SIZES.padding * 4,
    backgroundColor: COLORS.white,
  },
  name: {
    alignSelf: 'center',
    ...FONTS.h2,
    marginTop: SIZES.padding,
  },
  contact_text: {
    ...FONTS.body3,
    color: COLORS.black,
    marginLeft: SIZES.padding,
  },
})
