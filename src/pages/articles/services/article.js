import { stringify } from 'qs';

import request from '@/utils/request';

export async function queryArticleList(payload) {
  return request(`/naruto/v1/article/query?${stringify(payload)}`);
}

export async function queryArticleById(payload) {
  const { id } = payload;
  return request(`/naruto/v1/articles/${id}`);
}

export async function queryCatalog(payload) {
  return request(`/naruto/v1/catalogs/query?${stringify(payload)}`);
}

export async function addArticle(payload) {
  return request('/naruto/v1/article/add', {
    method: 'POST',
    data: payload,
  });
}

export async function queryCommentList(payload) {
  return request(`/naruto/v1/articles/comments?${stringify(payload)}`);
}

export async function addCommnet(payload) {
  return request('/naruto/v1/article/comment/add', {
    method: 'POST',
    data: payload,
  });
}
