import axios from 'axios';
import { showAlert } from './../alerts';

export const editStudentResult = async (courses, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/result/${id}`,
      data: {
        courses
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Your Result successfully updated!!');
      window.setTimeout(() => {
        location.assign('/dashboard');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
