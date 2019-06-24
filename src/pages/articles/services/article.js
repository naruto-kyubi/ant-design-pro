import { stringify } from 'qs';

import request from '@/utils/request';

export async function queryArticleList(payload) {
  return request(`/naruto/v1/articles/query?${stringify(payload)}`);
}

export async function queryArticleById(payload) {
  const { id } = payload;
  return request(`/naruto/v1/articles/${id}`);
}

export async function queryCatalog(payload) {
  return request(`/naruto/v1/catalogs/query?${stringify(payload)}`);
}

export async function addArticle(payload) {
  return request('/naruto/v1/articles/add', {
    method: 'POST',
    data: payload,
  });
}

export async function queryCommentList(payload) {
  return request(`/naruto/v1/articles/comments?${stringify(payload)}`);
}

export async function addCommnet(payload) {
  return request('/naruto/v1/articles/comment/add', {
    method: 'POST',
    data: payload,
  });
}

export async function queryArticleLikeById(payload) {
  const { targetId } = payload;
  return request(`/naruto/v1/articles/likes/article/${targetId}`);
}

export async function addLike(payload) {
  return request('/naruto/v1/articles/likes/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteLike(payload) {
  const { type, targetId } = payload;
  return request(`/naruto/v1/articles/likes/delete/${type}/${targetId}`);
}
export async function queryArticleStarById(payload) {
  const { articleId } = payload;
  return request(`/naruto/v1/articles/stars/${articleId}`);
}

export async function queryStarList(payload) {
  return request(`/naruto/v1/articles/stars/user/query?${stringify(payload)}`);
}

export async function addStar(payload) {
  return request('/naruto/v1/articles/stars/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteStar(payload) {
  const { articleId } = payload;
  return request(`/naruto/v1/articles/stars/delete/${articleId}`);
}
