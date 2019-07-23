import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryArticleStarById(payload) {
  const { articleId } = payload;
  return request(`/server/api/v1/articles/stars/${articleId}`);
}

export async function queryStarList(payload) {
  return request(`/server/api/v1/articles/stars/user/query?${stringify(payload)}`);
}

export async function addStar(payload) {
  return request('/server/api/v1/articles/stars/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteStar(payload) {
  const { articleId } = payload;
  return request(`/server/api/v1/articles/stars/delete/${articleId}`);
}
