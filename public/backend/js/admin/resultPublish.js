import axios from 'axios';
import { showAlert } from './../alerts';

const replaceData = (htmlMarkup, data, cnt) => {
  htmlMarkup = htmlMarkup.replace('code', data.courseCode);
  htmlMarkup = htmlMarkup.replace('credit', data.courseCredit);
  htmlMarkup = htmlMarkup.replace('title', data.courseName);
  htmlMarkup = htmlMarkup.replace(/{%cnt%}/g, cnt);

  document.querySelector('#data').insertAdjacentHTML('beforebegin', htmlMarkup);
};

export const getCourse = async (part, semester, session) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/course/semsterCourse',
      data: {
        part,
        semester,
        session
      }
    });

    const markup = `<div class="col-sm-2">
      <div class="form-group form-float">
        <div class="form-line">
        <input id="courseCode_{%cnt%}" class="form-control" type="text" value="code" />
    </div>
    </div>
  </div>
<div class="col-sm-2">
    <div class="form-group form-float">
        <div class="form-line"><input id="courseCredit_{%cnt%}" class="form-control" type="text" value="credit" /></div>
    </div>
</div>
<div class="col-sm-6">
    <div class="form-group form-float">
        <div class="form-line"><input id="courseName_{%cnt%}" class="form-control" type="text" value="title" /></div>
    </div>
</div>
  <div class="col-sm-2">
    <select id="courseGrade_{%cnt%}" class="form-control show-tick">
          <option value="">-- select --</option>
          <option value="A+">A+</option>
          <option value="A">A</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B">B</option>
          <option value="B-">B-</option>
          <option value="C+">C+</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="F">F</option>
    </select>
  </div>
<div class="col-sm-12"></div>`;
    let cnt = 1;
    res.data.data.forEach(el => {
      replaceData(markup, el, cnt);
      cnt++;
    });

    document.getElementById('resultData').value = res.data.data;
  } catch (err) {
    showAlert('error', 'No course found');
  }
};

export const publishResult = async (
  courses,
  studentId,
  part,
  semester,
  session
) => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/result',
      data: {
        courses,
        studentId,
        part,
        semester,
        session
      }
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Result publish successfully!');
      window.setTimeout(() => {
        location.assign('/results');
      }, 800);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
    window.setTimeout(() => {
      location.assign('/results');
    }, 800);
  }
};
