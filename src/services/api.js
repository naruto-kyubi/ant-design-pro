import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/naruto/v1/logon/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function register(params) {
  return request('/naruto/v1/user/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

// export async function getCaptcha(mobile) {
//   return request(`/naruto/v1/getCaptcha?mobile=${mobile}`);
// }
export async function getRegisterCaptcha(mobile) {
  return request(`/naruto/v1/user/registerCaptcha?mobile=${mobile}`);
}

export async function getForgotpasswordCaptcha(mobile) {
  return request(`/naruto/v1/user/forgotPasswordCaptcha?mobile=${mobile}`);
}

export async function getLogonCaptcha(mobile) {
  return request(`/naruto/v1/logon/captcha?mobile=${mobile}`);
}

export async function resetPassword(params) {
  return request('/naruto/v1/user/resetPassword', {
    method: 'POST',
    data: params,
  });
}

export async function addUser(params) {
  return request('/naruto/v1/user/add', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}
export async function removeUser(params) {
  // return request('/api/rule', {
  //   method: 'POST',
  //   data: {
  //     ...params,
  //     _method: 'DELETE',
  //   },
  // });
  const { key } = params;
  return request(`/naruto/v1/user/delete/${key}`, {
    method: 'DELETE',
  });
}

export async function updateUser(params = {}) {
  // return request(`/api/rule?${stringify(params.query)}`, {
  //   method: 'PUT',
  //   data: {
  //     ...params.body,
  //     method: 'update',
  //   },
  // });

  const { key } = params.body;
  return request(`/naruto/v1/user/update/${key}`, {
    method: 'PUT',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}
export async function queryUser(params) {
  return request(`/naruto/v1/user/query?${stringify(params)}`);
}

/**
 * @liuhaoyi
 * 获取当前登录用户对应的功能菜单。springboot依据token获取userName。
 */
export async function queryMenus() {
  return request('/naruto/v1//logon/function');
}
