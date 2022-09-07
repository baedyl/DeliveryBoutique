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
import Button from 'react-native-button'
import FastImage from 'react-native-fast-image'
import { Globalstyles } from '../../styles/GlobalStyle'
import { FONTS, SIZES, COLORS, icons, DATABASE_URL } from '../../constants'
import SignUpScreen from '../../Core/onboarding/screens/SignupScreen/SignupScreen'
import { Header, CustomButton } from '../../components'
import firestore from '@react-native-firebase/firestore'
import { useDispatch } from 'react-redux'
import { useCurrentUser } from '../../Core/onboarding'
import { useAuth } from '../../Core/onboarding/hooks/useAuth'
import { setUserData } from '../../Core/onboarding/redux/auth'
import { useTheme, useTranslations } from 'dopenative'

const AccountScreen = memo(props => {
  const { navigation } = props
  const currentUser = useCurrentUser()
  const dispatch = useDispatch()
  const [user, setUser] = useState({})
  const [birthdate, setBirthdate] = useState('')
  const authManager = useAuth()
  const { theme } = useTheme()
  const { localized } = useTranslations()

  useEffect(() => {
    firestore()
      .collection('users')
      .doc(currentUser?.userID)
      .onSnapshot(documentSnapshot => {
        const userData = documentSnapshot.data()
        // console.log('User data: ', userData)
        setUser(userData)
        const userBirthdate = userData?.birthdate
        if (userBirthdate?.seconds) {
          // We have a timestamp object
          setBirthdate(new Date(userBirthdate.toDate()).toLocaleString("fr-FR", {dateStyle: "medium"}))
        } else if (userBirthdate) {
          setBirthdate(userBirthdate.toString())
        }
      })

    if (!currentUser?.id) {
      // No user is logged in
      Alert.alert('Info!', 'Veuillez créer un compte pour continuer')
      navigation.navigate('LoginStack', {
        screen: 'Login',
      })
      return
    }
    const userBirthdate = user?.birthdate
    console.log('typeof userBirthdate ---> ', typeof userBirthdate);
    console.log('userBirthdate ---> ', userBirthdate);
    if (typeof userBirthdate === 'object' && userBirthdate.seconds) {
      // We have a timestamp object
      setBirthdate(new Date(userBirthdate.toDate()).toLocaleString("fr-FR"))
    } else if (userBirthdate) {
      setBirthdate(userBirthdate.toString())
    }

  }, [navigation, user.id])

  const onLogout = useCallback(() => {
    try {
      console.log('Logging out...')
      authManager?.logout(user)
      dispatch(setUserData({ user: null }))
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
  })

  const deleteAccount = useCallback(() => {
    try {
      Alert.alert('Attention!', 'Toutes vos données seront supprimées!', [
        {
          text: 'Annuler',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            authManager?.deleteUser(user.id)
            onLogout()
          },
        },
      ])
    } catch (error) {
      Alert.alert('Error', error.message)
    }
  })

  return (
    <>
      {user ? (
        <SafeAreaView style={Globalstyles.container_1}>
          <ScrollView>
            {/* Header */}
            <Header
              title="Compte"
              icon={theme.icons.logout}
              onPressIcon={onLogout}
            />

            <View style={Globalstyles.container_2}>
              {/* User Photo */}
              {user?.profilePictureURL == 'default' ||
              user?.profilePictureURL == '' ||
              user?.profilePictureURL == undefined ? (
                <View style={styles.image_container}>
                  <Image
                    source={icons.user}
                    resizeMode="center"
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 55
                      
                    }}
                  />
                </View>
              ) : (
                <View style={styles.image_container}>
                  <FastImage
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: 55
                    }}
                    source={{ uri: user?.profilePictureURL }}
                  />
                </View>
              )}
              {/* User Name */}
              <Text style={styles.name}>{user?.username}</Text>

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
                <Text style={styles.contact_text}>
                  {' '}
                  {user?.firstName + ' ' + user?.lastName}
                </Text>
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
                <Text style={styles.contact_text}> {user?.email}</Text>
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
                <Text style={styles.contact_text}> {user?.address}</Text>
              </View>

              {/* Phone */}
              <View
                style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
                <Image
                  source={icons.phone}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                <Text style={styles.contact_text}>{user?.phone}</Text>
              </View>

              {/* Birthdate */}
              <View
                style={{ flexDirection: 'row', marginTop: SIZES.padding * 2 }}>
                <Image
                  source={icons.time}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
                <Text style={styles.contact_text}>
                  { birthdate }
                </Text>
              </View>

              {/* Update Button */}
              <CustomButton
                text="Modifier Profil"
                onPressButton={() => {
                  navigation.navigate('UpdateProfile', { currentUser: user })
                }}
              />

              {/* Delete Button */}
              <CustomButton
                containerStyle={styles.delete_btn}
                text="Supprimer Compte"
                onPressButton={deleteAccount}
              />
            </View>
          </ScrollView>
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
  delete_btn: {
    backgroundColor: COLORS.red,
    color: COLORS.white,
    width: '70%',
    borderRadius: 25,
    padding: 10,
    marginTop: 30,
    alignSelf: 'center',
    justifyContent: 'center',
    height: 48,
  },
})
