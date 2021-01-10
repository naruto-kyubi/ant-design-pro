import request from '@/utils/request';

export async function querySubAccounts(payload) {
  const { owner,parent,type} = payload;
  return request(`/server/api/v1/subAccounts?owner=${owner}&parent=${parent}&type=${type}`);
}

export async function queryMainAccounts(payload) {
  const { owner} = payload;
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

export async function queryAccountTypes() {
  return request(`/server/api/v1/queryAccountTypes`);
}

