import axios from './axios';

export const stockNotificationAPI = {
  requestNotification: async (productId, email, phone, notificationChannels) => {
    const response = await axios.post('/stock-notifications/request', {
      productId,
      email,
      phone,
      notificationChannels
    });
    return response.data;
  }
};
