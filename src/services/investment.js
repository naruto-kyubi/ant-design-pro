import request from '@/utils/request';

export async function queryMainAccounts(payload) {
  const { owner } = payload;
  return request(`/server/api/v1/mainAccounts?owner=${owner}`);
}

export async function logon(payload) {
  const { id } = payload;
  return request(`/server/api/v1/connect?id=${id}`);
}

export async function queryBalance(payload) {
  const { id } = payload;
  return request(`/server/api/v1/queryBalance?id=${id}`);
}