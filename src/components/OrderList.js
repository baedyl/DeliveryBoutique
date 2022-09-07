import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import { setBoutique, setOrder } from '../redux/actions'
import { useDispatch, useSelector } from 'react-redux'
import { firebase } from '@react-native-firebase/database'
import { COLORS, SIZES, FONTS, icons, DATABASE_URL } from '../constants'
import { useCurrentUser } from '../Core/onboarding'

const OrderList = ({ navigation, orders, hasActiveOrder }) => {
  const dispatch = useDispatch()
  const userInfo = useCurrentUser()


  function displayOrderItems(item) {
    console.log('Delivered : ', item.delivered)
    var items = '\n'
    for (let i = 1; i <= item.totalItems; i++) {
      items = items + item[`item${i}`] + '\n'
    }

    return items
  }

  function acceptOrder(item) {
    console.log('hasActiveOrder: ', hasActiveOrder)
    const orderReference = firebase
        .app()
        .database(DATABASE_URL)
        .ref('/Order/' + item.oid)
    // For the current order change status
    if (item.valid) {
      // setOrderPicked(true)
      // Update order status to ready
      orderReference
      .update({
        ready: true,
      })
      .then(() => console.log('Order is ready!'))
      return
    }
    // if (hasActiveOrder) {
    //   Alert.alert(
    //     'Info!',
    //     "Veuillez livrer votre commande active avant d'accepter une autre.",
    //   );
    // } else {

    // }
    dispatch(setBoutique(item.boutique))
    dispatch(setOrder(item))

    if (userInfo) {
      // Update order status
      // Chage order's status and add deliver person's name
      orderReference
        .update({ valid: true })
        .then(() => console.log('Boutique accepted order!'))

      // navigation.navigate('Home')
    }
  }

  function deleteOrder(item) {
    Alert.alert('Info', 'Voulez vous vraiment annuler cette commande?', [
      {
        text: 'Non',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Oui',
        onPress: () => {
          // Update order status
          if (userInfo) {
            // Update order status
            const orderReference = firebase
              .app()
              .database(DATABASE_URL)
              .ref('/Order/' + item.oid)
      
            // Chage order's status and add deliver person's name
            orderReference
              .update({ cancelled: true })
              .then(() => console.log('Boutique rejected order!'))
              .catch(error => console.log(error.message))
      
            // navigation.navigate('Home')
          }
        },
      },
    ])
  }

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.container}>
        {/* Order No */}
        <View style={{ padding: SIZES.padding * 2 }}>
          {/* Order No */}
          <View style={styles.row}>
            <Text style={styles.order_no_text}>Commande : {index + 1}</Text>

            {/* Time */}
            <View style={{ flexDirection: 'row' }}>
              <Image
                source={icons.time}
                style={{ height: 20, width: 20, tintColor: COLORS.primary }}
              />
              <Text style={{ ...FONTS.body4, color: COLORS.black }}>
                {' '}
                {item.time} mins
              </Text>
            </View>
          </View>

          {/* Boutique */}
          <View style={styles.total}>
            <Text style={{ ...FONTS.body3, color: COLORS.black }}>Adresse</Text>
            <Text style={{ ...FONTS.body3, color: COLORS.black }}>
              {item?.address}
            </Text>
          </View>

          {/* Order Items */}
          <Text style={styles.order_items_text}>{displayOrderItems(item)}</Text>

          {/* Total */}
          <View style={styles.total}>
            <Text style={{ ...FONTS.body3, color: COLORS.black }}>Total: </Text>
            <Text style={{ ...FONTS.body2, color: COLORS.black }}>
              {item.total} DH
            </Text>
          </View>

          {/* Track & Cancel buttons */}
          <View style={styles.buttons_container}>
            <TouchableOpacity
              disabled={item.delivered || item.cancelled || item.ready}
              style={[styles.buttons, styles.button_enabled]}
              onPress={() => acceptOrder(item)}>
              <Text style={styles.buttons_text}>
                {!item.valid ? 'Accepter' : item.delivered ? 'Livrée' : 'Prêt'}
              </Text>
            </TouchableOpacity>

            
            {!item.valid || !item.ready ? (
              <TouchableOpacity
              style={{ ...styles.buttons, backgroundColor: 'red' }}
              onPress={() => deleteOrder(item)}>
              <Text style={styles.buttons_text}>Annuler</Text>
            </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{
          padding: 16,
        }}
      />
    </View>
  )
}

export default OrderList

const styles = StyleSheet.create({
  container: {
    margin: 8,
    elevation: 3,
    width: SIZES.width - 45,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.white,
  },
  order_no_text: {
    ...FONTS.h4,
    color: COLORS.black,
  },
  order_items_text: {
    ...FONTS.body4,
    color: COLORS.black,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray3,
    paddingVertical: 8,
    borderBottomColor: COLORS.lightGray3,
    borderBottomWidth: 1,
  },
  buttons_container: {
    padding: SIZES.padding * 2,
    paddingBottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttons: {
    backgroundColor: COLORS.primary,
    width: SIZES.width * 0.35,
    padding: SIZES.padding,
    alignItems: 'center',
    borderRadius: SIZES.radius,
    marginHorizontal: 20,
  },
  buttons_text: {
    ...FONTS.body4,
    color: COLORS.white,
  },
  button_disabled: {
    opacity: 0.3,
  },
  button_enabled: {
    opacity: 1,
  },
  row: {
    paddingBottom: 8,
    borderBottomColor: COLORS.lightGray3,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})
