import axios from 'axios';
import { showAlert } from './../alerts';

export const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/login',
      data: {
        email,
        password
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfull');
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

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/user/logout'
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged out successfull');
      window.setTimeout(() => {
        location.reload(true);
        location.assign('/login');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
