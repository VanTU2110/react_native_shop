import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import ProductItem from './ProductItem';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const numColumns = 3;

const Home = ({ navigation }) => {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://172.20.10.2:5000/api/product/products')
      .then(response => {
        console.log(response.data); // Kiểm tra dữ liệu
        if (response.data.success) {
          setProducts(response.data.result);
        } else {
          console.error('Error fetching data: ', response.data.message);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Menu')}>
            <Ionicons name="menu-outline" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Email')}>
              <Ionicons name="mail-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.logo}>CHIENSHOP</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Search')}>
            <Ionicons name="search-outline" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Favorites')}>
            <Ionicons name="heart-outline" size={24} color="black" style={styles.icon}/>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="cart-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <ProductItem product={item} />
          </TouchableOpacity>
        )}
        keyExtractor={item => item.MaSP.toString()}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
      />
       <View style={styles.bottomNavigation}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Trang chủ</Text>
          </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
          <Ionicons name="grid-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Danh mục</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
          <Ionicons name="cart-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Giỏ hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ProfileScreen')}>
          <Ionicons name="person-outline" size={24} color="black" style={styles.bottomIcon} />
          <Text style={styles.bottomText}>Cá nhân</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    height:80,
  },
  logo: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginEnd:5,
  },
  icon:{
    marginEnd: 10,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  bottomIcon: {
    marginHorizontal: 10,
  },
  bottomText: {
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  }
});

export default Home;