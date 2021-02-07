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

export async function dayEndClearing() {
  return request(`/server/api/v1/dayEndClearing`);
}

export async function queryAccountTypes() {
  return request(`/server/api/v1/queryAccountTypes`);
}

export async function queryIPOSubscriptions(payload) {
  const { stockId } = payload;
  return request(`/server/api/v1/ipoSubscriptions?stockId=${stockId}`);
}

export async function importData(payload) {
  const { stockId } = payload;
  return request(`/server/api/v1/importData?stockId=${stockId}`);
}

export async function addPlan(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/addPlan?stockId=${stockId}&id=${id}`);
}

export async function removePlan(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/removePlan?stockId=${stockId}&id=${id}`);
}

export async function ipo(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/ipo?stockId=${stockId}&id=${id}`);
}

export async function logonFinanceIPO(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/finance/logon?stockId=${stockId}&id=${id}`);
}

export async function prepareFinanceIPO(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/finance/prepare?stockId=${stockId}&id=${id}`);
}

export async function startFinanceIPO(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/finance/start?stockId=${stockId}&id=${id}`);
}

export async function quitFinanceIPO(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/finance/quit?stockId=${stockId}&id=${id}`);
}

export async function sign(payload) {
  const { stockId, id } = payload;
  return request(`/server/api/v1/sign?stockId=${stockId}&id=${id}`);
}

export async function updateIPO(payload) {
  return request('/server/api/v1/updateIPO', {
    method: 'POST',
    data: payload,
  });
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
