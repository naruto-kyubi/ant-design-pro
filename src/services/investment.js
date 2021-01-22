import request from '@/utils/request';

export async function querySubAccounts(payload) {
  const { owner, parent, type } = payload;
  return request(`/server/api/v1/subAccounts?owner=${owner}&parent=${parent}&type=${type}`);
}

export async function queryMainAccounts(payload) {
  const { owner } = payload;
  return request(`/server/api/v1/mainAccounts?owner=${owner}`);
}

export async function logon(payload) {
  const { id } = payload;
  return request(`/server/api/v1/connect?id=${id}`);
}

export async function executeTrans(payload) {
  const { id } = payload;
  return request(`/server/api/v1/executeTrans?id=${id}`);
}

export async function closeTrans(payload) {
  const { id } = payload;
  return request(`/server/api/v1/closeTrans?id=${id}`);
}

export async function installApp(payload) {
  const { account } = payload;
  return request(`/server/api/v1/installApp?account=${account}`);
}

export async function queryBalance(payload) {
  const { id } = payload;
  return request(`/server/api/v1/queryBalance?id=${id}`);
}

export async function queryAccountTypes() {
  return request(`/server/api/v1/queryAccountTypes`);
}

export async function queryIPOSubscriptions(payload) {
  const { stockCode } = payload;
  return request(`/server/api/v1/ipoSubscriptions?stockCode=${stockCode}`);
}

export async function importData(payload) {
  const { stockCode } = payload;
  return request(`/server/api/v1/importData?stockCode=${stockCode}`);
}

export async function addPlan(payload) {
  const { stockCode, id } = payload;
  return request(`/server/api/v1/addPlan?stockCode=${stockCode}&id=${id}`);
}

export async function ipo(payload) {
  const { stockCode, id } = payload;
  return request(`/server/api/v1/ipo?stockCode=${stockCode}&id=${id}`);
}

export async function sign(payload) {
  const { stockCode, id } = payload;
  return request(`/server/api/v1/sign?stockCode=${stockCode}&id=${id}`);
}

export async function queryStocks() {
  return request(`/server/api/v1/stocks`);
}

export async function addAccount(payload) {
  return request('/server/api/v1/addAccount', {
    method: 'POST',
    data: payload,
  });
}

export async function updateAccount(payload) {
  return request('/server/api/v1/updateAccount', {
    method: 'POST',
    data: payload,
  });
}

export async function addTrans(payload) {
  return request('/server/api/v1/addTrans', {
    method: 'POST',
    data: payload,
  });
}
