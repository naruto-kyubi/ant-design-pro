import request from '@/utils/request';

export async function queryArticleLikeById(payload) {
  const { targetId } = payload;
  return request(`/server/api/v1/articles/article/${targetId}/likes`);
}

export async function addLike(payload) {
  return request('/server/api/v1/articles/likes', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteLike(payload) {
  const { type, targetId } = payload;
  return request(`/server/api/v1/articles/${type}/${targetId}/likes`, {
    method: 'DELETE',
  });
}
