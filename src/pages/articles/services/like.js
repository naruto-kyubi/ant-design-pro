import request from '@/utils/request';

export async function queryArticleLikeById(payload) {
  const { targetId } = payload;
  return request(`/server/api/v1/articles/likes/article/${targetId}`);
}

export async function addLike(payload) {
  return request('/server/api/v1/articles/likes/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteLike(payload) {
  const { type, targetId } = payload;
  return request(`/server/api/v1/articles/likes/delete/${type}/${targetId}`);
}
