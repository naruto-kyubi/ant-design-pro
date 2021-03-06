import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryFollows(payload) {
  return request(`/server/api/v1/users/follows?${stringify(payload)}`);
}

export async function queryFollow(payload) {
  const { id } = payload;
  return request(`/server/api/v1/users/follow/${id}`);
}

export async function addFollow(payload) {
  return request('/server/api/v1/users/follows', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteFollow(payload) {
  const { id } = payload;
  return request(`/server/api/v1/users/follows/${id}`, {
    method: 'DELETE',
  });
}

export async function queryFans(payload) {
  return request(`/server/api/v1/users/fans?${stringify(payload)}`);
}

export async function search(payload) {
  return request(`/server/api/v1/follows/search?${stringify(payload)}`);
}
