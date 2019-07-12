import request from '@/utils/request';
import { stringify } from 'qs';

export async function searchall(payload) {
  return request(`/naruto/v1/search/searchall?${stringify(payload)}`);
}

export async function searchlike(payload) {
  return request(`/naruto/v1/search/likethis?${stringify(payload)}`);
}
