import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { FONTS, DATABASE_URL } from "../../constants";
import { OrderList, Header } from "../../components";
import { Globalstyles } from "../../styles/GlobalStyle";
import { firebase } from "@react-native-firebase/database";
import { useCurrentUser } from '../../Core/onboarding'
import { useSelector } from "react-redux";

const OrderScreen = ({ navigation }) => {
  const user = useCurrentUser();
  const [orders, setOrders] = useState([]);
  const orderReference = firebase.app().database(DATABASE_URL).ref("/Order/");

  useEffect(() => {
    let array = [];
    if (user) {
      orderReference.on(
        "value",
        (snapshot) => {
          snapshot.forEach((snapshotItem) => {
            var item = snapshotItem.val();
            if (item.userID == user.userID) array.push(item);
          });
          setOrders(array);
          array = [];
        },
        (err) => {
          console.log(err);
        }
      );
    } else setOrders([]);
  }, [user]);

  function deleteOrder(oid) {
    firebase
      .app()
      .database(DATABASE_URL)
      .ref("/Order/" + oid)
      .remove();
  }

  return (
    <SafeAreaView style={Globalstyles.container_1}>
      <Header title="Commandes" navigation={navigation} />
      {orders.length != 0 ? (
        <OrderList
          navigation={navigation}
          orders={orders}
          deleteOrder={deleteOrder}
        />
      ) : (
        <View style={styles.empty_text}>
          <Text style={{ ...FONTS.h4 }}>Aucune commande pour l'instant!</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  empty_text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
