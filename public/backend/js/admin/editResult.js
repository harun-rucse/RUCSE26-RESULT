import axios from 'axios';
import { showAlert } from './../alerts';

export const updateStudentResult = async (courses, studentId, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `http://127.0.0.1:4000/api/v1/result/${id}`,
      data: {
        courses,
        studentId
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Result Update successfull');
      window.setTimeout(() => {
        location.assign('/results');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteResult = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `http://127.0.0.1:4000/api/v1/result/${id}`
    });
    window.setTimeout(() => {
      location.assign('/results');
    }, 1000);
  } catch (err) {
    showAlert('error', 'Delete Failed. Please try again');
  }
};
