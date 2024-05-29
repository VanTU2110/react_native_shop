import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Button, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from './ipconfig';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${url}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setUser(response.data);
          fetchOrders(response.data._id);  // Fetch orders using user id
        } catch (error) {
          console.error('Lỗi khi lấy thông tin người dùng:', error);
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    const fetchOrders = async (userId) => {
      try {
        const response = await axios.get(`${url}/api/order/orders`, {
          params: { id: userId }
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy thông tin đơn hàng:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login'); // Điều hướng đến màn hình đăng nhập
  };

  const renderFooter = () => {
    return (
      <TouchableOpacity onPress={handleLogout}>
        <View style={styles.footer}>
          <Image
            source={{ uri: "https://raw.githubusercontent.com/coredxor/images/main/q5.png" }}
            resizeMode={"stretch"}
            style={styles.footerIcon}
          />
          <Text style={styles.footerText}>Log Out</Text>
          <View style={styles.footerIconPlaceholder} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không thể tải thông tin người dùng</Text>
      </View>
    );
  }

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderItem}>
      <Text style={styles.orderText}>Mã đơn hàng: {item._id}</Text>
      <Text style={styles.orderText}>Ngày đặt: {new Date(item.orderDate).toLocaleDateString()}</Text>
      <Text style={styles.orderText}>Địa chỉ: {item.address}</Text>
      <Text style={styles.orderText}>Tên người nhận: {item.recipientName}</Text>
      <Text style={styles.orderText}>Số điện thoại: {item.phoneNumber}</Text>
      <Text style={styles.orderText}>Tổng giá: {item.totalPrice} VND</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Text style={styles.label}>Tên người dùng:</Text>
      <Text style={styles.value}>{user.username}</Text>
      <Text style={styles.label}>Số điện thoại:</Text>
      <Text style={styles.value}>{user.phone}</Text>

      <Text style={styles.label}>Đơn hàng của bạn:</Text>
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item._id}
        />
      ) : (
        <Text>Không có đơn hàng nào</Text>
      )}

      {renderFooter()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 5,
    elevation: 3,
  },
  orderText: {
    fontSize: 16,
  },
  footer: {
    height: 65,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F2F3F2",
    borderRadius: 20,
    paddingHorizontal: 16,
    margin: 16,
  },
  footerIcon: {
    width: 18,
    height: 18,
  },
  footerText: {
    color: "#53B175",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerIconPlaceholder: {
    width: 18,
    height: 18,
  },
});

export default ProfileScreen;
