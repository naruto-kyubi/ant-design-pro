import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryAllTags(payload) {
  return request(`/server/api/v1/tags/all?${stringify(payload)}`);
}

export async function queryUserTags(payload) {
  return request(`/server/api/v1/users/tags/subscribed?${stringify(payload)}`);
}

export async function addTag(payload) {
  return request('/server/api/v1/users/tags/subscribe', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteTag(payload) {
  const { tagId } = payload;
  return request(`/server/api/v1/users/tags/${tagId}/unsubscribe`, {
    method: 'DELETE',
  });
}
