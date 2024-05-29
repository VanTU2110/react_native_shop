import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Button } from "react-native-elements";
import url from './ipconfig';

const Checkout = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [recipientName, setRecipientName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartString = await AsyncStorage.getItem('cart');
        if (cartString) {
          const cartItems = JSON.parse(cartString);
          setCart(cartItems);
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng từ AsyncStorage:", error);
      }
    };

    const loadUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const response = await axios.get(`${url}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = response.data;
          console.log("User loaded from API:", userData);
          setRecipientName(userData.username);
          setPhoneNumber(userData.phone);
          await AsyncStorage.setItem('user', JSON.stringify(userData));
        } else {
          const userString = await AsyncStorage.getItem('user');
          if (userString) {
            const user = JSON.parse(userString);
            console.log("User loaded from AsyncStorage:", user);
            setRecipientName(user.username);
            setPhoneNumber(user.phone);
          }
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin người dùng:", error);
      }
    };

    loadCart();
    loadUserData();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handlePlaceOrder = async () => {
    const orderDetails = {
      recipientName,
      address,
      phoneNumber,
      cart
    };

    try {
      const response = await fetch(`${url}/api/order/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Order placed:', data);
        await AsyncStorage.removeItem('cart');
        navigation.navigate('ProductList');
        Alert.alert("Đặt hàng thành công")
      } else {
        const errorData = await response.json();
        console.error('Failed to place order:', errorData);
        Alert.alert('Lỗi', 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Lỗi', 'Đặt hàng thất bại');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Thông tin người nhận</Text>
      <TextInput
        style={styles.input}
        placeholder="Họ và tên"
        value={recipientName}
        onChangeText={setRecipientName}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ nhận hàng"
        value={address}
        onChangeText={setAddress}
      />
      <Text style={styles.header}>Thông tin đơn hàng</Text>
      {cart.map((item) => (
        <View key={item.productCode} style={styles.itemContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Số lượng: {item.quantity}</Text>
          <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)} ₫</Text>
        </View>
      ))}
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng tiền: {formatPrice(getTotalPrice())} ₫</Text>
      </View>

      <Button
        title="Đặt hàng"
        onPress={handlePlaceOrder}
        buttonStyle={styles.placeOrderButton}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  itemContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#888',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
  },
  totalContainer: {
    marginTop: 20,
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  placeOrderButton: {
    backgroundColor: '#28a745',
    marginTop: 20,
  },
});

export default Checkout;
