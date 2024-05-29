import React, { useState } from 'react';
import { SafeAreaView, View, ImageBackground, Image, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import url from './ipconfig';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    const loginUrl = `${url}/api/auth/login`;
    console.log('Login URL:', loginUrl);

    try {
      const response = await axios.post(loginUrl, {
        email,
        password
      });
      console.log('Response data:', response.data);
      setMessage('Đăng nhập thành công');
      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      navigation.reset({
        index: 0,
        routes: [{ name: 'ProductList' }],
      });
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Đã xảy ra lỗi');
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      } else if (error.request) {
        setMessage('No response received from the server');
        console.log('Request data:', error.request);
      } else {
        setMessage('Error in setting up the request');
        console.log('Error message:', error.message);
      }
      console.log('Error config:', error.config);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={{ uri: 'https://raw.githubusercontent.com/coredxor/images/main/bk_login.png' }}
        resizeMode='stretch'
        style={styles.background}
      >
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://raw.githubusercontent.com/coredxor/images/main/carot_login.png' }}
            resizeMode='stretch'
            style={styles.logo}
          />
        </View>
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>Phục vụ bằng cả cái tâm</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>LOG IN</Text>
        </TouchableOpacity>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupButtonText}> Đăng kí</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  background: {
    flex: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    margin: 50,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    color: '#181725',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#7C7C7C',
    fontSize: 16,
    marginVertical: 20,
  },
  inputContainer: {
    marginVertical: 16,
  },
  label: {
    color: '#7C7C7C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    color: '#181725',
    fontSize: 18,
    marginVertical: 12,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E2E2',
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#181725',
    fontSize: 14,
  },
  loginButton: {
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#53B175',
    borderRadius: 20,
    marginVertical: 20,
  },
  loginButtonText: {
    color: '#FFF9FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  message: {
    marginTop: 20,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupText: {
    color: '#181725',
    fontSize: 14,
  },
  signupButtonText: {
    color: '#53B175',
    fontSize: 14,
  },
});

export default LoginScreen;
