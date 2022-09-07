import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { FONTS, DATABASE_URL, icons } from '../../constants'
import { Globalstyles } from '../../styles/GlobalStyle'
import { Header, OrderList } from '../../components'
import { firebase } from '@react-native-firebase/database'
import { useCurrentUser } from '../../Core/onboarding'
import Geocoder from 'react-native-geocoding'
import PushNotificationIOS from '../../../notifications';

const clone = require('rfdc')()

const Order = ({ navigation }) => {
  const user = useCurrentUser()
  const [orders, setOrders] = useState([])
  const [clientAddress, setClientAddress] = useState(null)
  const [hasActiveOrder, setHasActiveOrder] = useState(false)
  const orderReference = firebase.app().database(DATABASE_URL).ref('/Order/')

  const setNotification = (boutique) => {
    PushNotificationIOS.addNotificationRequest({
      id: 'newcommand',
      title: 'Nouveau!',
      subtitle: 'Dispo',
      body: 'Commande Disponible, ' + boutique,
      sound: 'customSound.wav',
      badge: 1,
      fireDate: new Date(new Date().valueOf() + 3000).toISOString()
    });
  };

  useEffect(() => {
    let array = []
    let didCancel = false
    // Get current user's infos
    const currentUser = firebase.auth().currentUser
    console.log('current user: ', currentUser)

    // Declare the client's address fetching function
    const fetchClientAddress = async location => {
      if (!didCancel) {
        Geocoder.from(location.latitude, location.longitude)
          .then(json => {
            let addressComponent =
              json.results[0].address_components[0].short_name.length
            if (
              typeof addressComponent != 'string' ||
              addressComponent.length < 5
            ) {
              addressComponent =
                json.results[0].address_components[1].short_name
            }
            console.log('fetched address: ', addressComponent)
            setClientAddress(addressComponent)
          })
          .catch(error => console.warn(error))
      }
    }
    if (currentUser) {
      // Get orders data
      orderReference.on(
        'value',
        snapshot => {
          snapshot.forEach(snapshotItem => {
            const item = snapshotItem.val()

            if (
              item?.boutique?.name === user?.boutique
            ) {
              let itemClientLocation = ''
              // Search by geo-location (reverse geo-code)
              fetchClientAddress(item.address)
              
              console.log('CLient Address: ', clientAddress)
              item.address = clientAddress
              array.push(clone(item))
              if (!item.ready && !item.valid) {
                setNotification(item.boutique?.name)
              }
            }
            // if (item.deliver_by && item.deliver_by.uid === user.uid) {
            //   setHasActiveOrder(true);
            // }
          })
          setOrders(array)
          array = []
        },
        err => {
          console.log(err)
        },
      )
    } else {
      setOrders([])
    }
    return () => {
      didCancel = true
    }
  }, [user, clientAddress])

  return (
    <SafeAreaView style={Globalstyles.container_1}>
      <Header title="Commandes" icon={icons.order} navigation={navigation} />
      {orders.length != 0 ? (
        <OrderList
          navigation={navigation}
          orders={orders}
          hasActiveOrder={hasActiveOrder}
        />
      ) : (
        <View style={styles.empty_text}>
          <Text style={{ ...FONTS.h4 }}>Aucune commande pour l'instant!</Text>
        </View>
      )}
    </SafeAreaView>
  )
}

export default Order

const styles = StyleSheet.create({
  empty_text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
