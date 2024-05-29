import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Alert, Text, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductItem from './ProductItem';
import Icon from 'react-native-vector-icons/Ionicons';
import url from './ipconfig';

const numColumns = 2;

const ProductList = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/product/products`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/product/search?productName=${searchQuery}`);
      setProducts(response.data);
      setLoading(false);
      setIsSearching(true); // Đánh dấu rằng đang trong trạng thái tìm kiếm
    } catch (error) {
      console.error('Error searching products:', error);
      setLoading(false);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const cartItems = await AsyncStorage.getItem('cart');
      let cart = cartItems ? JSON.parse(cartItems) : [];
  
      const existingProductIndex = cart.findIndex(item => item.productCode === product.productCode);
      if (existingProductIndex !== -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        product.quantity = 1;
        cart.push(product);
      }
  
      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      Alert.alert('Thành công', `${product.name} đã được thêm vào giỏ hàng.`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm vào giỏ hàng.');
    }
  };

  // Hàm để quay lại trang sản phẩm và load lại danh sách sản phẩm
  const navigateToProductList = () => {
    setIsSearching(false); // Đặt lại trạng thái tìm kiếm về false
    fetchProducts(); // Load lại danh sách sản phẩm
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
          <Icon name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>
      {/* Dòng text "Danh sách sản phẩm" chỉ hiển thị nút điều hướng khi đang tìm kiếm */}
      <TouchableOpacity onPress={navigateToProductList}>
        <Text style={styles.title}>
          {isSearching ? 'Quay lại danh sách sản phẩm' : 'Danh sách sản phẩm'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <ProductItem product={item} onAddToCart={() => handleAddToCart(item)} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.productCode.toString()}
        numColumns={numColumns}
        contentContainerStyle={styles.listContent}
      />
      <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('ProductList')}>
          <Icon name="home-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Icon name="grid-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Danh mục</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchBarContainer: {
    marginTop :50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Increased margin bottom to lower the search bar
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchIcon: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  productItem: {
    flex: 1,
    margin: 5,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
  bottomIcon: {
    marginBottom: 5,
  },
  bottomText: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default ProductList;
