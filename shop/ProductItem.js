import React from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
const ProductItem = ({ product, onAddToCart }) => {
  return (
    <View style={styles.itemContainer}>
      <Image source={{ uri: product.img_url }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.description}>{product.description}</Text>
      <Text style={styles.price}>Price: {formatPrice(product.price)} đ</Text>
      <Text style={styles.quantity}>Available Quantity: {product.quantity}</Text>
      <Button title="Add to Cart" onPress={() => onAddToCart(product)} />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    margin: 10,
    padding: 10,
    backgroundColor: '#fff',  
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 5,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  quantity: {
    fontSize: 14,
    color: '#888',
    marginBottom: 10,
  },
});

export default ProductItem;
