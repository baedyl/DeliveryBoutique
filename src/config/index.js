import React, { useContext } from 'react'
import { useTranslations } from 'dopenative'
import { Platform } from 'react-native'

const regexForNames = /^[a-zA-Z]{2,25}$/

export const ConfigContext = React.createContext({})

export const ConfigProvider = ({ children }) => {
  const { localized } = useTranslations()
  const config = {
    isSMSAuthEnabled: false,
    appIdentifier: `io.instamobile.rn.${Platform.OS}`,
    facebookIdentifier: '323707493061958',
    webClientId:
      '1099201876026-7p9f7c1ukg55958ck45fc0bn0luilka4.apps.googleusercontent.com',
    onboardingConfig: {
      welcomeTitle: localized('The-AfricanBasket-Partners'),
      welcomeCaption: localized(
        'Bienvenue chez The-AfricanBasket!',
      ),
      walkthroughScreens: [
        {
          icon: require('../assets/icons/LOGOTAB.png'),
          title: localized(''),
          description: localized(
            'Guide des fonctionnalités',
          ),
        },
        {
          icon: require('../assets/icons/login-icon.png'),
          title: localized('Création de compte'),
          description: localized(
            'Connectez vous à la plateforme et accédez aux boutiques',
          ),
        },
        // {
        //   icon: require('../assets/icons/sms-icon.png'),
        //   title: localized('SMS Authentication'),
        //   description: localized(
        //     'End-to-end SMS OTP verification for your users.',
        //   ),
        // },
        {
          icon: require('../assets/icons/country-picker-icon.png'),
          title: localized('Boutiques'),
          description: localized('Découvrez des boutiques et restaurants près de chez vous'),
        },
        {
          icon: require('../assets/icons/reset-password-icon.png'),
          title: localized('Récupération'),
          description: localized(
            'Réinitialisation de mot de passe via e-mail.',
          ),
        },
        // {
        //   icon: require('../assets/images/instagram.png'),
        //   title: localized('Profile Photo Upload'),
        //   description: localized(
        //     'Ability to upload profile photos to Firebase Storage.',
        //   ),
        // },
        {
          icon: require('../assets/images/pin.png'),
          title: localized('Localisation'),
          description: localized(
            'Localisation et visualisation sur la carte',
          ),
        },
        {
          icon: require('../assets/images/notification.png'),
          title: localized('Notifications'),
          description: localized(
            'Activez des notifications pour ne rien manquer',
          ),
        },
      ],
    },
    tosLink: 'https://www.instamobile.io/eula-instachatty/',
    isUsernameFieldEnabled: false,
    smsSignupFields: [
      {
        displayName: localized('First Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: 'First Name',
      },
      {
        displayName: localized('Last Name'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: 'Last Name',
      },
      {
        displayName: localized('Username'),
        type: 'default',
        editable: true,
        regex: regexForNames,
        key: 'username',
        placeholder: 'Username',
        autoCapitalize: 'none',
      },
    ],
    signupFields: [
      {
        displayName: localized('Prénom'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'firstName',
        placeholder: 'Prénom',
      },
      {
        displayName: localized('Nom'),
        type: 'ascii-capable',
        editable: true,
        regex: regexForNames,
        key: 'lastName',
        placeholder: 'Nom',
      },
      {
        displayName: localized('Surnom'),
        type: 'default',
        editable: true,
        regex: regexForNames,
        key: 'username',
        placeholder: 'Surnom',
        autoCapitalize: 'none',
      },
      {
        displayName: localized('Adresse E-mail'),
        type: 'email-address',
        editable: true,
        regex: regexForNames,
        key: 'email',
        placeholder: 'Adresse E-mail',
        autoCapitalize: 'none',
      },
      {
        displayName: localized('Mot de passe'),
        type: 'default',
        secureTextEntry: true,
        editable: true,
        regex: regexForNames,
        key: 'password',
        placeholder: 'Mot de passe',
        autoCapitalize: 'none',
      },
    ],
  }

  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => useContext(ConfigContext)
