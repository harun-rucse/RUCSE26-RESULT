import axios from 'axios';
import { showAlert } from './../alerts';

export const updateMyProfile = async data => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: '/api/v1/user/updateMe',
      data
    });
    if (res.data.status === 'success') {
      showAlert('success', 'DATA update successfully!');
      window.setTimeout(() => {
        location.assign('/profile');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
