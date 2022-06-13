import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {FONTS, DATABASE_URL} from '../constants';
import {OrderList} from '../components';
import {Globalstyles} from '../styles/GlobalStyle';
import {Header} from '../components';
import {firebase} from '@react-native-firebase/database';
import {useSelector} from 'react-redux';

const Order = ({navigation}) => {
  const {user} = useSelector(state => state.userReducer);
  const [orders, setOrders] = useState([]);
  const [hasActiveOrder, setHasActiveOrder] = useState(false);
  const orderReference = firebase.app().database(DATABASE_URL).ref('/Order/');

  useEffect(() => {
    let array = [];
    // Get current user's infos
    const currentUser = firebase.auth().currentUser;
    console.log('current user: ', currentUser);
    if (currentUser) {
      const userReference = firebase
        .app()
        .database(DATABASE_URL)
        .ref('/Users/' + currentUser.uid);
      userReference.on('value', snapshot => {
        const userInfos = snapshot.val();
        console.log('snapshot: ', userInfos);

        // Get orders data
        orderReference.on(
          'value',
          snapshot => {
            snapshot.forEach(snapshotItem => {
              const item = snapshotItem.val();
              // console.log('user: ', userInfos);
              if (
                !item.valid &&
                !item.cancelled &&
                item?.boutique?.name === userInfos?.boutique
              ) {
                array.push(item);
              }
              if (item.deliver_by && item.deliver_by.uid === user.uid) {
                setHasActiveOrder(true);
              }
            });
            setOrders(array);
            array = [];
          },
          err => {
            console.log(err);
          },
        );
      });
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <SafeAreaView style={Globalstyles.container_1}>
      <Header title="Commandes" icon={2} navigation={navigation} />
      {orders.length != 0 ? (
        <OrderList
          navigation={navigation}
          orders={orders}
          hasActiveOrder={hasActiveOrder}
        />
      ) : (
        <View style={styles.empty_text}>
          <Text style={{...FONTS.h4}}>Aucune commande pour l'instant!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Order;

const styles = StyleSheet.create({
  empty_text: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
