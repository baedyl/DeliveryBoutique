import React, { useState, useRef, useEffect } from 'react'
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Button from 'react-native-button'
import PhoneInput from 'react-native-phone-input'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useDispatch } from 'react-redux'
import { useTheme, useTranslations } from 'dopenative'
import dynamicStyles from './styles'
import TNActivityIndicator from '../../../truly-native/TNActivityIndicator'
import TNProfilePictureSelector from '../../../truly-native/TNProfilePictureSelector/TNProfilePictureSelector'
import CountriesModalPicker from '../../../truly-native/CountriesModalPicker/CountriesModalPicker'
import { setUserData } from '../../redux/auth'
import { localizedErrorMessage } from '../../api/ErrorCode'
import TermsOfUseView from '../../components/TermsOfUseView'
import { useOnboardingConfig } from '../../hooks/useOnboardingConfig'
import { useAuth } from '../../hooks/useAuth'
import DatePicker from 'react-native-date-picker'

const SignupScreen = props => {
  const { navigation } = props
  const authManager = useAuth()
  const dispatch = useDispatch()

  const { config } = useOnboardingConfig()
  const { localized } = useTranslations()
  const { theme, appearance } = useTheme()
  const styles = dynamicStyles(theme, appearance)

  const [inputFields, setInputFields] = useState({})

  const [profilePictureFile, setProfilePictureFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const phoneRef = useRef(null)
  const [countriesPickerData, setCountriesPickerData] = useState(null)
  const [countryModalVisible, setCountryModalVisible] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(false)
  const [birthdate, setBirthdate] = useState(new Date())
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (phoneRef && phoneRef.current) {
      setCountriesPickerData(phoneRef.current.getPickerData())
    }
  }, [phoneRef])

  const validateEmail = text => {
    let reg =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(String(text).toLowerCase()) ? true : false
  }

  const validatePassword = text => {
    let reg = /^(?=.*[A-Z])(?=.*[a-z])/
    return reg.test(String(text)) ? true : false
  }

  const trimFields = fields => {
    var trimmedFields = {}
    Object.keys(fields).forEach(key => {
      if (fields[key]) {
        trimmedFields[key] = fields[key].trim()
      }
    })
    return trimmedFields
  }

  const onRegister = async () => {
    const { error: usernameError } =
      await authManager.validateUsernameFieldIfNeeded(inputFields, config)
    if (usernameError) {
      Alert.alert('', localized(usernameError), [{ text: localized('OK') }], {
        cancelable: false,
      })
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    if (!validateEmail(inputFields?.email?.trim())) {
      Alert.alert(
        '',
        localized('Veuillez saisir une adresse électronique valide.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      return
    }

    if (inputFields?.password?.trim() == '') {
      Alert.alert(
        '',
        localized('Le mot de passe ne peut pas être vide.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    if (inputFields?.password?.trim()?.length < 6) {
      Alert.alert(
        '',
        localized(
          'Le mot de passe est trop court. Veuillez utiliser au moins 6 caractères pour des raisons de sécurité.',
        ),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      setInputFields(prevFields => ({
        ...prevFields,
        password: '',
      }))
      return
    }

    const userValidPhoneNumber = phoneRef.current.getValue()
    setPhoneNumber(userValidPhoneNumber)

    if (userValidPhoneNumber.trim().length < 13) {
      // setLoading(false)
      Alert.alert(
        '',
        localized('Le numéro de téléphone est incorrect.'),
        [{ text: localized('OK') }],
        {
          cancelable: false,
        },
      )
      setInputFields(prevFields => ({
        ...prevFields,
      }))
      return
    }

    // if (!validatePassword(password)) {
    //   Alert.alert(
    //     '',
    //     localized(
    //       'The password must contain at least one uppercase and lowercase letter',
    //     ),
    //     [{ text: localized('OK') }],
    //     {
    //       cancelable: false,
    //     },
    //   );
    //   setPassword('');
    //   return;
    // };

    setLoading(true)

    const userDetails = {
      ...trimFields(inputFields),
      photoFile: profilePictureFile,
      appIdentifier: config.appIdentifier,
      phone: userValidPhoneNumber,
      birthdate: birthdate,
    }
    if (userDetails.username) {
      userDetails.username = userDetails.username?.toLowerCase()
    }

    authManager
      .createAccountWithEmailAndPassword(userDetails, config)
      .then(response => {
        const user = response.user
        if (user) {
          dispatch(setUserData({ user }))
          Keyboard.dismiss()
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainStack', params: { user } }],
          })
        } else {
          setLoading(false)
          Alert.alert(
            '',
            localizedErrorMessage(response.error, localized),
            [{ text: localized('OK') }],
            {
              cancelable: false,
            },
          )
        }
      })
  }

  const onChangeInputFields = (text, key) => {
    setInputFields(prevFields => ({
      ...prevFields,
      [key]: text,
    }))
  }

  const renderInputField = (field, index) => {
    return (
      <TextInput
        key={index?.toString()}
        style={styles.InputContainer}
        placeholder={field.placeholder}
        placeholderTextColor="#aaaaaa"
        secureTextEntry={field.secureTextEntry}
        onChangeText={text => onChangeInputFields(text, field.key)}
        value={inputFields[field.key]}
        keyboardType={field.type}
        underlineColorAndroid="transparent"
        autoCapitalize={field.autoCapitalize}
      />
    )
  }

  const renderBirthdateInput = () => {
    return (
      <>
        <Button onPress={() => setOpen(true)}>Date de naissance</Button>
        <DatePicker
          modal
          open={open}
          mode={"date"}
          date={birthdate}
          onConfirm={date => {
            setOpen(false)
            setBirthdate(date)
          }}
          onCancel={() => {
            setOpen(false)
          }}
        />
      </>
    )
  }

  const renderSignupWithEmail = () => {
    return (
      <>
        {config.signupFields.map(renderInputField)}
        {renderPhoneInput()}
        {renderBirthdateInput()}
        <Button
          containerStyle={styles.signupContainer}
          style={styles.signupText}
          onPress={() => onRegister()}>
          {localized('Sign Up')}
        </Button>
      </>
    )
  }

  const onPressCancelContryModalPicker = () => {
    setCountryModalVisible(false)
  }

  const onPressFlag = () => {
    setCountryModalVisible(true)
  }

  const selectCountry = country => {
    phoneRef.current.selectCountry(country.iso2)
  }

  const renderPhoneInput = () => {
    return (
      <>
        <PhoneInput
          style={styles.InputContainer}
          flagStyle={styles.flagStyle}
          textStyle={styles.phoneInputTextStyle}
          ref={phoneRef}
          initialCountry={'ma'}
          onPressFlag={onPressFlag}
          offset={10}
          allowZeroAfterCountryCode
          textProps={{
            placeholder: localized('Phone number'),
            placeholderTextColor: '#aaaaaa',
          }}
        />
        {countriesPickerData && (
          <CountriesModalPicker
            data={countriesPickerData}
            onChange={country => {
              selectCountry(country)
            }}
            cancelText={localized('Cancel')}
            visible={countryModalVisible}
            onCancel={onPressCancelContryModalPicker}
          />
        )}
        {/* <Button
          containerStyle={styles.sendContainer}
          style={styles.sendText}
          onPress={() => onPressSend()}>
          {localized('Send code')}
        </Button> */}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: '100%' }}
        keyboardShouldPersistTaps="always">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image style={styles.backArrowStyle} source={theme.icons.backArrow} />
        </TouchableOpacity>
        <Text style={styles.title}>{localized('Création de compte')}</Text>
        <TNProfilePictureSelector
          setProfilePictureFile={setProfilePictureFile}
        />
        {renderSignupWithEmail()}
        {config.isSMSAuthEnabled && (
          <>
            <Text style={styles.orTextStyle}>{localized('OR')}</Text>
            <Button
              containerStyle={styles.PhoneNumberContainer}
              onPress={() => navigation.navigate('Sms', { isSigningUp: true })}>
              {localized('Sign up with phone number')}
            </Button>
          </>
        )}
        <TermsOfUseView
          tosLink={config.tosLink}
          privacyPolicyLink={config.privacyPolicyLink}
          style={styles.tos}
        />
      </KeyboardAwareScrollView>
      {loading && <TNActivityIndicator />}
    </View>
  )
}

export default SignupScreen
