/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function queryArticles() {
  return request(`/naruto/v1/article/query`);
}

export async function addArticle(payload) {
  // return request(`/naruto/v1/article/add`);

  return request('/naruto/v1/article/add', {
    method: 'POST',
    data: payload,
  });
}
