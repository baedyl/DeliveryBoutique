import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
  Image,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {AppStyles} from '../AppStyles';
// import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import {Globalstyles} from '../styles/GlobalStyle';
import {CustomButton, ProgressBar} from '../components';
import {Formik} from 'formik';
import * as yup from 'yup';
import {images, COLORS} from '../constants';
import {setUser} from '../redux/actions';
import {useDispatch} from 'react-redux';

//validation schema for signin form
const signInSchema = yup.object({
  email: yup
    .string()
    .label('Email')
    .required()
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'email address is not valid',
    ),
  password: yup.string().label('Password').required().min(8),
});

const LoginScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [screen, setScreen] = useState(null);
  const [item, setItem] = useState(null);
  const [category, setCategory] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userInfo, setUserInfo] = useState(null);

  useEffect(route => {
    if (route && route.params) {
      const {screen, currentItem, currentCategory} = route.params;
      setScreen(screen);
      setItem(currentItem);
      setCategory(currentCategory);
    }
  }, []);

  //signin user with email and password
  const signInUser = async values => {
    setClicked(true);
    try {
      let response = await auth().signInWithEmailAndPassword(
        values.email,
        values.password,
      );
      if (response && response.user) {
        setClicked(false);
        dispatch(setUser(response.user));
        setUserInfo(response.user);
        // navigation.navigate("Home", { screen: "Home" });
        // if (screen == "Account") {
        //   navigation.navigate("Account", { screen: "Account" });
        // } else {
        //   navigation.navigate("Restaurant", {
        //     currentItem: item,
        //     currentCategory: category,
        //   });
        // }
      }
    } catch (e) {
      Alert.alert('Error', e.message);
      setClicked(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss()}>
      {/* <Text style={[styles.title, styles.leftTitle]}>Connectez-vous</Text> */}
      <View style={Globalstyles.container_2}>
        {/*logo */}
        <Image
          source={images.logo}
          resizeMode="contain"
          style={Globalstyles.logo}
        />

        <ScrollView>
          {/* signin form */}
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={signInSchema}
            onSubmit={values => {
              signInUser(
                values,
                navigation,
                screen,
                item,
                category,
                setClicked,
                dispatch,
              );
            }}>
            {props => (
              <View>
                {/* email field */}
                <TextInput
                  style={Globalstyles.input}
                  placeholder=" Email"
                  placeholderTextColor={COLORS.primary}
                  autoCapitalize="none"
                  onChangeText={props.handleChange('email')}
                  value={props.values.email}
                  keyboardType="email-address"
                  onBlur={props.handleBlur('email')}
                />
                {props.touched.email && props.errors.email && (
                  <Text style={Globalstyles.errorText}>
                    {props.errors.email}
                  </Text>
                )}

                {/* password field*/}
                <TextInput
                  style={Globalstyles.input}
                  placeholder=" Mot de passe"
                  placeholderTextColor={COLORS.primary}
                  onChangeText={props.handleChange('password')}
                  value={props.values.password}
                  secureTextEntry
                  onBlur={props.handleBlur('password')}
                />
                {props.touched.password && props.errors.password && (
                  <Text style={Globalstyles.errorText}>
                    {props.errors.password}
                  </Text>
                )}

                {/* signin button */}
                <CustomButton
                  text="Se connecter"
                  onPressButton={props.handleSubmit}
                />

                {/* forgot password */}
                {/* <TouchableOpacity
                    onPress={() => navigation.navigate("ForgotPassword")}
                    style={Globalstyles.hyperlink_container}
                  >
                    <Text style={Globalstyles.hyperlink_text}>
                      Forgot password?
                    </Text>
                  </TouchableOpacity> */}
              </View>
            )}
          </Formik>

          {/* hyperlink signup */}
          <View style={Globalstyles.hyperlink_container}>
            <Text style={Globalstyles.account_text}>
              Vous n'avez pas de compte?{' '}
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp', {screen: screen})}>
              <Text style={Globalstyles.hyperlink_text}>Créer un compte</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* progress bar */}
        {clicked && <ProgressBar text="Veuillez patienter..." />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
