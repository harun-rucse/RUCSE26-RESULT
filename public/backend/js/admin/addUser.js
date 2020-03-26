import axios from 'axios';
import { showAlert } from './../alerts';

export const addNewUser = async (
  name,
  email,
  studentId,
  phone,
  password,
  passwordConfirm,
  role
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:4000/api/v1/user',
      data: {
        name,
        email,
        studentId,
        phone,
        password,
        passwordConfirm,
        role
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'User Add successfull');
      window.setTimeout(() => {
        location.assign('/users');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
