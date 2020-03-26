import axios from 'axios';
import { showAlert } from './../alerts';

export const changeMyPassword = async (
  currentPassword,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMyPassword',
      data: {
        currentPassword,
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Password changed successfull');
      window.setTimeout(() => {
        location.assign('/login');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
