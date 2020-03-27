import '@babel/polyfill';
import { showAlert } from './alerts';
import { login, logout } from './auth/login';
import { signup } from './auth/signup';
import { updateMyProfile } from './student/updateMe';
import { changeMyPassword } from './student/changeMyPassword';
import { getCourse, publishResult } from './admin/resultPublish';
import { updateUserInfo, deleteUser } from './admin/editUser';
import { addNewUser } from './admin/addUser';
import {
  replaceData,
  markup,
  saveCourseCategory
} from './admin/addCourseCategory';
import { updateStudentResult, deleteResult } from './admin/editResult';
import { updateCourseCategory, deleteCourseCategory } from './admin/editCourse';
import { deleteNotificatio } from './deleteNotification';
import { forgotPassword, resetPassword } from './auth/resetPassword';

//DOM Elements
const loginBtn = document.querySelector('#sign_in');
const logOutBtn = document.querySelector('#logout-btn');
const signupForm = document.querySelector('#sign_up');
const updateMeBtn = document.querySelector('#update_me');
const changeMyPasswordBtn = document.querySelector('#update_my_password');
const courseShowBtn = document.querySelector('#course_show');
const resultPublishBtn = document.querySelector('#result_publish');
const editUserBtn = document.querySelector('#edit_user_btn');
const deleteUserBtns = document.querySelectorAll('#delete_user_btn');
const deleteResultBtns = document.querySelectorAll('#delete_result_btn');
const deleteCourseBtns = document.querySelectorAll('#delete_course_btn');

const addUserBtn = document.querySelector('#add_user_btn');
const addCatBtn = document.querySelector('#add_course_category');
const nOfCourse = document.querySelector('#nOfCourse');
const saveCatBtn = document.querySelector('#save_course_category');
const resultEditBtn = document.querySelector('#result_edit_btn');
const courseEditBtn = document.querySelector('#course_edit_btn');

const nOfResult = document.querySelector('#nOfCoursesResult');
const nOfCourseCat = document.querySelector('#nOfCoursesCategory');
const forgotPasswordBtn = document.querySelector('#forgotPassword_btn');
const resetPasswordBtn = document.querySelector('#reset_password');

//Course Category Handle
if (addCatBtn) {
  let cnt = 1;
  addCatBtn.addEventListener('click', () => {
    nOfCourse.value = cnt;
    replaceData(markup, cnt);
    cnt++;
  });
}

if (saveCatBtn) {
  saveCatBtn.addEventListener('click', () => {
    let courses = [],
      isNull = false;

    for (var i = 1; i <= nOfCourse.value; i++) {
      let obj = {};
      //console.log(document.getElementById(`courseName_${i}`).value);
      if (
        document.getElementById(`courseName_${i}`).value === '' ||
        document.getElementById(`courseCode_${i}`).value === '' ||
        document.getElementById(`courseCredit_${i}`).value === ''
      ) {
        isNull = true;
      }
      obj.courseName = document.getElementById(`courseName_${i}`).value;
      obj.courseCode = document.getElementById(`courseCode_${i}`).value;
      obj.courseCredit = document.getElementById(`courseCredit_${i}`).value;
      courses.push(obj);
    }
    const part = document.querySelector('#part').options[
      document.querySelector('#part').selectedIndex
    ].value;
    const semester = document.querySelector('#semester').options[
      document.querySelector('#semester').selectedIndex
    ].value;
    const session = document.querySelector('#session').options[
      document.querySelector('#session').selectedIndex
    ].value;
    //console.log('session=', session, 'isNull=', isNull);
    if (session === '') {
      showAlert('error', 'Please Select a Session');
    } else if (isNull === true) {
      showAlert('error', 'Please fillup all fields');
    } else {
      saveCourseCategory(courses, part, semester, session);
    }
  });
}

//Login Handle
if (loginBtn) {
  loginBtn.addEventListener('submit', e => {
    e.preventDefault();

    const studentId = document.getElementById('studentId').value;
    const password = document.getElementById('password').value;
    login(studentId, password);
  });
}

//Logged out Handle
if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

//Signup Handle
if (signupForm) {
  signupForm.addEventListener('submit', e => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const studentId = document.getElementById('studentId').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    signup(name, email, studentId, phone, password, passwordConfirm);
  });
}

//User Information Update Handle [for user]
if (updateMeBtn) {
  updateMeBtn.addEventListener('submit', e => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('studentId', document.getElementById('studentId').value);
    form.append('phone', document.getElementById('phone').value);
    form.append('skill', document.getElementById('skill').value);
    form.append('description', document.getElementById('description').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateMyProfile(form);
  });
}

//User Password Update Handle [for user]
if (changeMyPasswordBtn) {
  changeMyPasswordBtn.addEventListener('submit', e => {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    changeMyPassword(currentPassword, password, passwordConfirm);
  });
}

// Student Result Publish Handle
if (courseShowBtn) {
  courseShowBtn.addEventListener('click', () => {
    const partSelectElement = document.querySelector('#part');
    const semesterSelectElement = document.querySelector('#semester');
    const part =
      partSelectElement.options[partSelectElement.selectedIndex].value;
    const semester =
      semesterSelectElement.options[semesterSelectElement.selectedIndex].value;
    const session = document.querySelector('#session').options[
      document.querySelector('#session').selectedIndex
    ].value;
    getCourse(part, semester, session);
  });
}
if (resultPublishBtn) {
  resultPublishBtn.addEventListener('click', () => {
    let checkEmpty = false;

    const data = document.getElementById('resultData').value;

    const courses = data.map((el, index) => {
      let obj = {};
      obj.courseName = el.courseName;
      obj.courseCode = el.courseCode;
      obj.courseCredit = el.courseCredit;
      obj.courseGrade = document.querySelector(
        `#courseGrade_${index + 1}`
      ).options[
        document.querySelector(`#courseGrade_${index + 1}`).selectedIndex
      ].value;
      return obj;
    });

    const part = document.querySelector('#part').options[
      document.querySelector('#part').selectedIndex
    ].value;

    const semester = document.querySelector('#semester').options[
      document.querySelector('#semester').selectedIndex
    ].value;

    const studentId = document.querySelector('#studentId').value;

    const session = document.querySelector('#session').options[
      document.querySelector('#session').selectedIndex
    ].value;

    courses.forEach(course => {
      if (course.courseGrade === '') {
        showAlert('error', 'Please select course Grade');
        checkEmpty = true;
      }
    });
    if (studentId === '') {
      showAlert('error', 'Please Enter Student ID');
      checkEmpty = true;
    }
    if (session === '') {
      showAlert('error', 'Please Enter Session');
      checkEmpty = true;
    }
    if (!checkEmpty) {
      publishResult(courses, studentId, part, semester, session);
    }
  });
}

//Result Edit Handle
if (resultEditBtn) {
  resultEditBtn.addEventListener('click', () => {
    const id = resultEditBtn.value;
    const studentId = document.getElementById('studentId').value;
    let courses = [];
    for (var i = 1; i <= nOfResult.value; i++) {
      let obj = {};
      obj.courseName = document.getElementById(`courseName_${i}`).value;
      obj.courseCode = document.getElementById(`courseCode_${i}`).value;
      obj.courseCredit = document.getElementById(`courseCredit_${i}`).value;
      obj.courseGrade = document.querySelector(`#courseGrade_${i}`).options[
        document.querySelector(`#courseGrade_${i}`).selectedIndex
      ].value;
      courses.push(obj);
    }
    updateStudentResult(courses, studentId, id);
  });
}

// Course Edit Handle [for Admin]

if (courseEditBtn) {
  courseEditBtn.addEventListener('click', () => {
    const id = courseEditBtn.value;
    let courses = [];
    for (var i = 1; i <= nOfCourseCat.value; i++) {
      let obj = {};
      obj.courseName = document.getElementById(`courseName_${i}`).value;
      obj.courseCode = document.getElementById(`courseCode_${i}`).value;
      obj.courseCredit = document.getElementById(`courseCredit_${i}`).value;
      courses.push(obj);
    }
    updateCourseCategory(courses, id);
  });
}

//User Information Edit handle [for Admin]
if (editUserBtn) {
  editUserBtn.addEventListener('click', () => {
    const userId = editUserBtn.value;
    const name = document.querySelector('#name').value;
    const studentId = document.querySelector('#studentId').value;
    const email = document.querySelector('#email').value;
    const phone = document.querySelector('#phone').value;
    const role = document.querySelector('#edit_user_role').options[
      document.querySelector('#edit_user_role').selectedIndex
    ].value;
    updateUserInfo(name, email, studentId, phone, role, userId);
  });
}

//Add New User handle [for Admin]
if (addUserBtn) {
  addUserBtn.addEventListener('click', () => {
    const name = document.querySelector('#name').value;
    const studentId = document.querySelector('#studentId').value;
    const email = document.querySelector('#email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const phone = document.querySelector('#phone').value;
    const role = document.querySelector('#add_user_select').options[
      document.querySelector('#add_user_select').selectedIndex
    ].value;
    if (role === '') {
      showAlert('error', 'Please Select a user role');
    } else {
      addNewUser(
        name,
        email,
        studentId,
        phone,
        password,
        passwordConfirm,
        role
      );
    }
  });
}

// Delete User handle [for Admin]
deleteNotificatio(deleteUserBtns, deleteUser);

// Delete Result handle [for Admin]
deleteNotificatio(deleteResultBtns, deleteResult);

// Delete Course handle [for Admin]
deleteNotificatio(deleteCourseBtns, deleteCourseCategory);

// Password Forgot Handle
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener('click', () => {
    const email = document.querySelector('#email').value;

    forgotPassword(email);
  });
}

if (resetPasswordBtn) {
  resetPasswordBtn.addEventListener('submit', e => {
    e.preventDefault();

    const token = document.getElementById('resettoken').value;
    const password = document.querySelector('#password').value;
    const passwordConfirm = document.querySelector('#passwordConfirm').value;

    resetPassword(token, password, passwordConfirm);
  });
}
