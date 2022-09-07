/**
 * Sample React Native Home
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React from 'react';
 import {
   SafeAreaView,
   ScrollView,
   StatusBar,
   StyleSheet,
   Text,
   Image,
   useColorScheme,
   View,
 } from 'react-native';
 import {Globalstyles} from '../../styles/GlobalStyle';
 import {images, COLORS} from '../../constants';
 import {
   Colors,
 } from 'react-native/Libraries/NewAppScreen';
 
 const Section = ({children, title}) => {
   const isDarkMode = useColorScheme() === 'dark';
   return (
     <View style={styles.sectionContainer}>
       <Text
         style={[
           styles.sectionTitle,
           {
             color: isDarkMode ? Colors.white : Colors.black,
           },
         ]}>
         {title}
       </Text>
       <Text
         style={[
           styles.sectionDescription,
           {
             color: isDarkMode ? Colors.light : Colors.dark,
           },
         ]}>
         {children}
       </Text>
     </View>
   );
 };
 
 const Home = () => {
   const isDarkMode = useColorScheme() === 'dark';
 
   const backgroundStyle = {
     backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
     flex: 3,
   };
 
   return (
     <View style={backgroundStyle}>
       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
       <ScrollView contentInsetAdjustmentBehavior="automatic">
         {/*logo */}
         <Image
           source={images.logo}
           resizeMode="contain"
           style={Globalstyles.logo}
         />
         <View style={{flex: 1}}>
           <Section title="Acceptation">
             Dans l'onglet <Text style={styles.highlight}>Commandes</Text> vous
             pouvez accepter de nouvelles commandes.
           </Section>
           <Section title="Refus">
             Dans le même onglet vous pouvez également refuser des commandes
           </Section>
           <Section title="Gestion">
             Bientôt vous pourrez modifier les articles de votre boutique ou
             restaurant
           </Section>
         </View>
       </ScrollView>
     </View>
   );
 };
 
 const styles = StyleSheet.create({
   sectionContainer: {
     marginTop: 32,
     paddingHorizontal: 24,
   },
   sectionTitle: {
     fontSize: 24,
     fontWeight: '600',
   },
   sectionDescription: {
     marginTop: 8,
     fontSize: 18,
     fontWeight: '400',
   },
   highlight: {
     fontWeight: '700',
   },
 });
 
 export default Home;
 