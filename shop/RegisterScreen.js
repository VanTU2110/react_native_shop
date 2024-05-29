import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Keyboard, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import url from './ipconfig';
const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');


  const handleRegister = async () => {
    // Kiểm tra xem confirm password có trùng với password không
    if (password !== confirmPassword) {
      setMessage("Mật khẩu và xác nhận mật khẩu không khớp");
      return; // Dừng hàm handleRegister nếu mật khẩu không khớp
    }

    try {
      const response = await axios.post(`${url}/api/auth/register`, {
        email,
        password,
        username,
        phone
      });
      if (response && response.data && response.data.message) {
        setMessage(response.data.message);
      }
      if (response && response.status === 201) {
        Alert.alert("Đăng kí thành công");
        Keyboard.dismiss();
        navigation.navigate('Login');
      }
    } catch (error) {
      console.log(Error);
      console.error(error)
      setMessage(error.response?.data?.message || 'Đã xảy ra lỗi');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Tên người dùng"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />
      <Button title="Đăng ký" onPress={handleRegister} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.swapButton}>Đã có tài khoản? Đăng nhập ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
  },
  swapButton: {
    marginTop: 10,
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
