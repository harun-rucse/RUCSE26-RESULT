import axios from 'axios';
import { showAlert } from './../alerts';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/forgotPassword',
      data: {
        email
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Email send successfully.Check Email!!!');
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const resetPassword = async (token, password, passwordConfirm) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/user/resetPassword/${token}`,
      data: {
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfully!');
      window.setTimeout(() => {
        if (res.data.data.user.role === 'admin') {
          location.assign('/admin');
        } else {
          location.assign('/dashboard');
        }
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
