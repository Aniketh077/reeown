import axios from './axios';

export const otpAPI = {
  sendOTP: async (phoneNumber) => {
    const response = await axios.post('/otp/send', { phoneNumber });
    return response.data;
  },

  verifyOTP: async (phoneNumber, otp, name = null) => {
    const response = await axios.post('/otp/verify', {
      phoneNumber,
      otp,
      ...(name && { name })
    });
    return response.data;
  },

  resendOTP: async (phoneNumber) => {
    const response = await axios.post('/otp/resend', { phoneNumber });
    return response.data;
  }
};
