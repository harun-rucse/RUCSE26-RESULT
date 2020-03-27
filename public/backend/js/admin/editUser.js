import axios from 'axios';
import { showAlert } from './../alerts';

export const updateUserInfo = async (
  name,
  email,
  studentId,
  phone,
  role,
  id
) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/user/${id}`,
      data: {
        name,
        email,
        studentId,
        phone,
        role
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User information successfully updated!');
      window.setTimeout(() => {
        location.assign('/users');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteUser = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/user/${id}`
    });
    window.setTimeout(() => {
      location.assign('/users');
    }, 1000);
  } catch (err) {
    showAlert('error', 'Delete Failed. Please try again');
  }
};
