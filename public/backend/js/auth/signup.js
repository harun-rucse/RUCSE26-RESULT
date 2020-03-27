import axios from 'axios';
import { showAlert } from './../alerts';

export const signup = async (
  name,
  email,
  studentId,
  phone,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/user/singup',
      data: {
        name,
        email,
        studentId,
        phone,
        password,
        passwordConfirm
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Signup successfully!');
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 100);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
