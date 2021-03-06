import { stringify } from 'qs';

import request from '@/utils/request';

export async function queryArticleList(payload) {
  return request(`/server/api/v1/articles?${stringify(payload)}`);
}

export async function queryFollowArticleList(payload) {
  return request(`/server/api/v1/follows/articles?${stringify(payload)}`);
}

export async function queryHotList(payload) {
  return request(`/server/api/v1/articles/hot?${stringify(payload)}`);
}

export async function querUser2ArticleList(payload) {
  const { userId, ...args } = payload;
  return request(`/server/api/v1/users/${userId}/articles?${stringify(args)}`);
}

export async function queryArticleById(payload) {
  const { id } = payload;
  return request(`/server/api/v1/articles/${id}`);
}

export async function queryCatalog(payload) {
  return request(`/server/api/v1/catalogs?${stringify(payload)}`);
}

export async function queryDraftList(payload) {
  return request(`/server/api/v1/articles/draft?${stringify(payload)}`);
}

export async function queryDraftById(payload) {
  const { id } = payload;
  return request(`/server/api/v1/articles/draft/${id}`);
}

export async function queryTag(payload) {
  return request(`/server/api/v1/articles/tags?${stringify(payload)}`);
}

export async function saveArticle(payload) {
  return request('/server/api/v1/articles', {
    method: 'POST',
    data: payload,
  });
}

export async function queryCommentList(payload) {
  return request(`/server/api/v1/articles/comments?${stringify(payload)}`);
}

export async function addCommnet(payload) {
  return request('/server/api/v1/articles/comments', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteArticle(payload) {
  const { targetId } = payload;
  return request(`/server/api/v1/articles/delete/${targetId}`);
}

export async function querySearchList(payload) {
  return request(`/server/api/v1/articles/search?${stringify(payload)}`);
}
