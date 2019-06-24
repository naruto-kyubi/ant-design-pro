import request from '@/utils/request';
import { stringify } from 'qs';

export async function queryFans(payload) {
  return request(`/naruto/v1/follows/fans?${stringify(payload)}`);
}

export async function queryFollows(payload) {
  return request(`/naruto/v1/follows/users?${stringify(payload)}`);
}

export async function queryFollow(payload) {
  const { id } = payload;
  return request(`/naruto/v1/follows/${id}`);
}

export async function addFollow(payload) {
  return request('/naruto/v1/follows/add', {
    method: 'POST',
    data: payload,
  });
}

export async function deleteFollow(payload) {
  const { id } = payload;
  return request(`/naruto/v1/follows/delete/${id}`);
}
