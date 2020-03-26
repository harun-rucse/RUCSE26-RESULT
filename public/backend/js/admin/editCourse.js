import axios from 'axios';
import { showAlert } from './../alerts';

export const updateCourseCategory = async (courses, id) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/course/${id}`,
      data: {
        courses
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Course Update successfull');
      window.setTimeout(() => {
        location.assign('/courses');
      }, 500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteCourseCategory = async id => {
  try {
    const res = await axios({
      method: 'DELETE',
      url: `/api/v1/course/${id}`
    });
    window.setTimeout(() => {
      location.assign('/courses');
    }, 1000);
  } catch (err) {
    showAlert('error', 'Delete Failed. Please try again');
  }
};
