import React, { useState, useEffect } from 'react'
import {
  Alert,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  ScrollView,
} from 'react-native'
import Button from 'react-native-button'
import DatePicker from 'react-native-date-picker'
import { Globalstyles } from '../../styles/GlobalStyle'
import { launchImageLibrary } from 'react-native-image-picker'
import { Formik } from 'formik'
import * as yup from 'yup'
import { InnerHeader, ProgressBar, CustomButton } from '../../components'
import { FONTS, SIZES, COLORS, icons, DATABASE_URL } from '../../constants'
import { firebase } from '@react-native-firebase/database'
import storage from '@react-native-firebase/storage'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import Geocoder from 'react-native-geocoding'
import firestore from '@react-native-firebase/firestore'
import { utils } from '@react-native-firebase/app'
import TNProfilePictureSelector from '../../Core/truly-native/TNProfilePictureSelector/TNProfilePictureSelector'

const GOOGLE_PLACES_API_KEY = 'AIzaSyBSWfme3FulpbRxcMzQ9JOaRUJPWIn2vKo' // never save your real api key in a snack!
Geocoder.init('AIzaSyBSWfme3FulpbRxcMzQ9JOaRUJPWIn2vKo')

//validation schema for update
const updateSchema = yup.object({
  name: yup.string().label('Name').required().min(3),
  firstname: yup.string().label('FirstName').required().min(3),
  lastname: yup.string().label('LastName').required().min(3),
  phone: yup
    .string()
    .label('Phone number')
    .required()
    .matches(/^[+]\d{12}$/, 'Numéro de téléphone incorrect'),
})
let newAddress = ''

const UpdateProfile = ({ route, navigation }) => {
  const [user, setUser] = useState({})
  const [image, setImage] = useState('')
  const [clicked, setClicked] = useState(false)
  const usersRef = firestore().collection('users')
  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [birthdate, setBirthdate] = useState(new Date())
  const [open, setOpen] = useState(false)

  // create bucket storage reference to not yet existing image
  const reference = storage().ref(user.id)

  useEffect(() => {
    const { currentUser } = route.params
    setUser(currentUser)
    setImage(currentUser.photoUrl)
  }, [])

  //function for updating user information
  const updateUser = async (values, navigation, user, image, setClicked) => {
    console.log('User Profile Picture ---> ', user.profilePictureURL)
    console.log('User selected Image ---> ', image)
    setClicked(true)
    let userLocation = null

    // Geocoding user's location
    await Geocoder.from(newAddress !== '' ? newAddress : user.address)
      .then(json => {
        const location = json.results[0].geometry.location
        console.log('location: ', location)
        userLocation = {
          latitude: location.lat,
          longitude: location.lng,
        }
      })
      .catch(error => console.warn(error))

    try {
      if (
        image == 'default' ||
        image == undefined
        // || (image && image.includes('https:'))
      ) {
        console.log('location', userLocation)
        usersRef
          .doc(user.id)
          .update({
            // address: user.address,
            addressSupplement: values.addressSupplement,
            birthdate: birthdate,
            username: values.name,
            firstName: values.firstname,
            lastName: values.lastname,
            address: newAddress !== '' ? newAddress : user.address,
            phone: values.phone,
            location: userLocation,
          })
          .then(() => {
            console.log('User updated!')
          })
          .catch(e => {
            Alert.alert('Error', e.message)
          })
      } else {
        // path to existing file on filesystem
        const filename = image.uri
        const uploadUri =
          Platform.OS === 'ios' ? filename.replace('file://', '') : filename
        const reference = storage().ref('/Users profile pics/' + filename)

        // uploads file
        await reference.putFile(uploadUri)

        const userProfilePictureUrl = await reference.getDownloadURL()

        usersRef
          .doc(user.id)
          .update({
            // address: user.address,
            addressSupplement: values.addressSupplement,
            birthdate: birthdate,
            username: values.name,
            firstName: values.firstname,
            lastName: values.lastname,
            address: newAddress !== '' ? newAddress : user.address,
            phone: values.phone,
            location: userLocation,
            profilePictureURL: userProfilePictureUrl,
          })
          .then(() => {
            console.log('User updated!')
          })
          .catch(e => {
            Alert.alert('Error', e.message)
          })
      }
    } catch (e) {
      Alert.alert('Error', e.message)
    } finally {
      setClicked(false)
      navigation.navigate('Account')
    }
  }

  //function for taking/selecting photo
  const selectImage = () => {
    const options = {
      maxWidth: 2000,
      maxHeight: 2000,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    }

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker')
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error)
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton)
      } else {
        const source = { uri: response.uri }
        setImage(source.uri)
      }
    })
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
      <SafeAreaView style={Globalstyles.container_1}>
        {/* Header */}
        {/* <InnerHeader title="Modifier Profil" navigation={navigation} /> */}

        <View style={Globalstyles.container_2}>
          {/* User Photo */}
          {/* {image == 'default' || image == '' || image == undefined ? (
            <View style={styles.image_view}>
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
            <Image source={{ uri: image }} style={styles.image} />
          )} */}

          {/* Change profile pic */}
          {/* <TouchableOpacity onPress={selectImage}>
            <Text style={styles.hyperlink_text}>Changer photo de profil</Text>
          </TouchableOpacity> */}

          <TNProfilePictureSelector
            setProfilePictureFile={setProfilePictureFile}
          />

          <ScrollView keyboardShouldPersistTaps="handled" horizontal={false}>
            <Formik
              enableReinitialize={true}
              initialValues={{
                name: user?.username,
                firstname: user?.firstName,
                lastname: user?.lastName,
                phone: user.phone,
                address: user.address,
                addressSupplement: user?.addressSupplement || '',
              }}
              validationSchema={updateSchema}
              onSubmit={values => {
                updateUser(
                  values,
                  navigation,
                  user,
                  profilePictureFile,
                  setClicked,
                )
              }}>
              {props => (
                <View>
                  {/* Username field */}
                  <TextInput
                    style={Globalstyles.input}
                    placeholder={user.name}
                    onChangeText={props.handleChange('name')}
                    value={props.values.name}
                    onBlur={props.handleBlur('name')}
                  />
                  {props.touched.name && props.errors.name && (
                    <Text style={Globalstyles.errorText}>
                      {props.errors.name}
                    </Text>
                  )}

                  {/* First & last names fields */}
                  <TextInput
                    style={Globalstyles.input}
                    placeholder={user.firstname}
                    onChangeText={props.handleChange('firstname')}
                    value={props.values.firstname}
                    onBlur={props.handleBlur('firstname')}
                  />
                  {props.touched.firstname && props.errors.firstname && (
                    <Text style={Globalstyles.errorText}>
                      {props.errors.firstname}
                    </Text>
                  )}
                  <TextInput
                    style={Globalstyles.input}
                    placeholder={user.lastname}
                    onChangeText={props.handleChange('lastname')}
                    value={props.values.lastname}
                    onBlur={props.handleBlur('lastname')}
                  />
                  {props.touched.lastname && props.errors.lastname && (
                    <Text style={Globalstyles.errorText}>
                      {props.errors.lastname}
                    </Text>
                  )}

                  {/* Phone number field */}
                  <TextInput
                    style={Globalstyles.input}
                    placeholder={user.phone}
                    onChangeText={props.handleChange('phone')}
                    value={props.values.phone}
                    keyboardType="numeric"
                    onBlur={props.handleBlur('phone')}
                  />
                  {props.touched.phone && props.errors.phone && (
                    <Text style={Globalstyles.errorText}>
                      {props.errors.phone}
                    </Text>
                  )}

                  <View style={Globalstyles.input}>
                    <ScrollView horizontal={true}>
                      <GooglePlacesAutocomplete
                        placeholder={user.address || 'Adresse'}
                        value={props.values.address}
                        query={{
                          key: GOOGLE_PLACES_API_KEY,
                          language: 'fr', // language of the results
                        }}
                        onPress={(data, details = null) =>
                          (newAddress = data.description)
                        }
                        onFail={error => console.error(error)}
                        requestUrl={{
                          url: 'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api',
                          useOnPlatform: 'web',
                        }} // this in only required for use on the web. See https://git.io/JflFv more for details.
                      />
                    </ScrollView>
                  </View>

                  {/* Address Supplement field */}
                  <TextInput
                    style={Globalstyles.input}
                    placeholder={user?.addressSupplement || 'Rue, N° Apt, ...'}
                    onChangeText={props.handleChange('addressSupplement')}
                    value={props.values.addressSupplement}
                    onBlur={props.handleBlur('addressSupplement')}
                  />
                  {props.touched.addressSupplement &&
                    props.errors.addressSupplement && (
                      <Text style={Globalstyles.errorText}>
                        {props.errors.addressSupplement}
                      </Text>
                    )}

                  <Button onPress={() => setOpen(true)}>
                    Date de naissance
                  </Button>
                  <DatePicker
                    modal
                    locale='fr'
                    open={open}
                    mode={'date'}
                    date={birthdate}
                    onConfirm={date => {
                      setOpen(false)
                      setBirthdate(date)
                    }}
                    onCancel={() => {
                      setOpen(false)
                    }}
                  />

                  {/* Save button */}
                  <CustomButton
                    text="Sauvegarder"
                    onPressButton={props.handleSubmit}
                  />
                </View>
              )}
            </Formik>
          </ScrollView>

          {/* progress bar */}
          {clicked && <ProgressBar text="Updating..." />}
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  )
}

export default UpdateProfile

const styles = StyleSheet.create({
  image_view: {
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    height: 100,
    borderRadius: 55,
    marginTop: SIZES.padding * 4,
    backgroundColor: COLORS.white,
  },

  image: {
    width: 100,
    height: 100,
    borderRadius: 55,
    marginTop: SIZES.padding * 4,
    alignSelf: 'center',
  },

  hyperlink_text: {
    alignSelf: 'center',
    ...FONTS.body3,
    color: 'blue',
    textDecorationLine: 'underline',
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding * 2,
  },
})