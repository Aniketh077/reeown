import axios from './axios';

export const stockNotificationAPI = {
  requestNotification: async (productId, email) => {
    const response = await axios.post('/stock-notifications/request', {
      productId,
      email
    });
    return response.data;
  }
};
