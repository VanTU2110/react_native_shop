import React from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductDetail = ({ route, navigation }) => {
  const { product } = route.params;

  const addToCart = async () => {
    try {
      const existingCart = await AsyncStorage.getItem('cart');
      let cart = existingCart ? JSON.parse(existingCart) : [];

      const existingProductIndex = cart.findIndex(item => item.productCode === product.productCode);
      if (existingProductIndex !== -1) {
        // Product already exists in cart
        cart[existingProductIndex].quantity += 1;
      } else {
        // Product does not exist in cart, add it
        cart = [...cart, { ...product, quantity: 1 }];
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log("Đã thêm sản phẩm vào giỏ hàng:", product);
      navigation.navigate('Cart');
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: product.img_url }} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.text_ThongTin}>Thông tin sản phẩm</Text>
          <Text style={styles.text}><Text style={styles.boldText}>{product.name}</Text></Text>
          <Text style={styles.text}>Giá: <Text style={[styles.boldText, styles.largeText]}>{formatPrice(product.price)} ₫</Text></Text>
          <Text style={styles.quantity}>Available Quantity: {product.quantity}</Text>
          <TouchableOpacity style={styles.addToCartButton} onPress={addToCart}>
            <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 8,
  },
  infoContainer: {
    alignItems: 'center',
  },
  text_ThongTin: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#555',
  },
  largeText: {
    fontSize: 20,
    color: '#007bff',
  },
  addToCartButton: {
    backgroundColor: "#007bff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 20,
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default ProductDetail;
