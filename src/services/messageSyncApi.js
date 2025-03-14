// src/services/messageSyncApi.js
import api from './api';

// ดึงข้อมูลการซิงค์ล่าสุดของผู้ใช้
export const getMessageSync = async (username) => {
  try {
    const response = await api.get('/messageSync', { 
      params: { username } 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// อัพเดตหรือสร้างข้อมูลการซิงค์
export const saveMessageSync = async (data) => {
  try {
    const response = await api.post('/messageSync', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};