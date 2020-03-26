import axios from 'axios';
import { showAlert } from './../alerts';

export const replaceData = (htmlMarkup, cnt) => {
  htmlMarkup = htmlMarkup.replace(/{%cnt%}/g, cnt);

  document.querySelector('#data').insertAdjacentHTML('beforebegin', htmlMarkup);
};
export const markup = `<div class="col-sm-4">
      <div class="form-group form-float">
        <div class="form-line">
        <input id="courseCode_{%cnt%}" class="form-control" type="text" placeholder="Course Code" />
    </div>
    </div>
  </div>
<div class="col-sm-4">
    <div class="form-group form-float">
        <div class="form-line"><input id="courseCredit_{%cnt%}" class="form-control" type="text" placeholder="Course Credit"/></div>
    </div>
</div>
<div class="col-sm-4">
    <div class="form-group form-float">
        <div class="form-line"><input id="courseName_{%cnt%}" class="form-control" type="text" placeholder="Course Title" /></div>
    </div>
</div>
<div class="col-sm-12"></div>`;

export const saveCourseCategory = async (courses, part, semester, session) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/course',
      data: {
        courses,
        part,
        semester,
        session
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Course Add successfully');
      window.setTimeout(() => {
        location.assign('/courses');
      }, 800);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
