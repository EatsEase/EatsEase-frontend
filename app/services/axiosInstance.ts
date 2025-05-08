import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import React from 'react';

// สร้าง Reference สำหรับ Navigation
export const navigationRef = React.createRef<any>();

const axiosInstance = axios.create({
  baseURL: 'https://eatsease-backend-1jbu.onrender.com/api/',
});

// ✅ ดักจับ API Error
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.error("🔴 API Error:", error.response?.status, error.response?.data);

    // ถ้า error 401 (Unauthorized) → ล้าง Token แล้วให้ User Login ใหม่
    if (error.response?.status === 401) {
      // await AsyncStorage.removeItem('token'); // ล้าง Token
      return Promise.reject(error);
    }

    // ถ้า error 500+ หรือ Network Error → ส่งไปหน้า Error Screen
    if (error.response?.status >= 500 || !error.response) {
      navigationRef.current?.dispatch(
        CommonActions.navigate({ name: 'ErrorScreen' })
      );
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
