import axios from './axios';

export const stockNotificationAPI = {
  requestNotification: async (productId, email) => {
    const response = await axios.post('/api/stock-notifications/request', {
      productId,
      email
    });
    return response.data;
  }
};
