import {
  querySubAccounts,
  queryMainAccounts,
  logon,
  queryBalance,
  queryAccountTypes,
  queryIPOSubscriptions,
  queryStocks,
  addAccount,
  updateAccount,
  addPlan,
  removePlan,
  ipo,
  sign,
  updateIPO,
  addTrans,
  importData,
  installApp,
  closeTrans,
  executeTrans,
} from '@/services/investment';

export default {
  namespace: 'investment',

  state: {
    mainAccounts: [],
    subAccounts: [],
    accountTypes: [],
    ipoSubscriptions: [],
    stocks: [],
  },

  effects: {
    *querySubAccounts({ payload }, { call, put }) {
      const response = yield call(querySubAccounts, payload);
      const { status, data } = response;

      yield put({
        type: 'saveSubAccounts',
        payload: {
          status,
          data,
        },
      });
    },

    *queryMainAccounts({ payload }, { call, put }) {
      const response = yield call(queryMainAccounts, payload);
      const { status, data } = response;

      yield put({
        type: 'saveMainAccounts',
        payload: {
          status,
          data,
        },
      });
    },

    *logon({ payload }, { call }) {
      yield call(logon, payload);
      // const response = yield call(logon, payload);
      // const { data } = response;
      // console.log(data);
    },

    *executeTrans({ payload }, { call }) {
      yield call(executeTrans, payload);
      // const response = yield call(logon, payload);
      // const { data } = response;
      // console.log(data);
    },

    *closeTrans({ payload }, { call }) {
      yield call(closeTrans, payload);
      // const response = yield call(logon, payload);
      // const { data } = response;
      // console.log(data);
    },

    *installApp({ payload }, { call }) {
      yield call(installApp, payload);
      // const response = yield call(logon, payload);
      // const { data } = response;
      // console.log(data);
    },

    *addAccount({ payload }, { call }) {
      yield call(addAccount, payload);
      // const response = yield call(addAccount, payload);
      // const {  data } = response;
      // console.log(payload);
    },

    *addTrans({ payload }, { call }) {
      yield call(addTrans, payload);
      // const response = yield call(addAccount, payload);
      // const {  data } = response;
      // console.log(payload);
    },

    *updateAccount({ payload }, { call, put }) {
      // yield call(updateAccount, payload);
      const response = yield call(updateAccount, payload);
      const { status, data } = response;
      yield put({
        type: 'saveAccountOperationInfo',
        payload: {
          status,
          data,
        },
      });
      // console.log(payload);
    },

    *queryBalance({ payload }, { call, put }) {
      // yield call(queryBalance, payload);
      const response = yield call(queryBalance, payload);
      const { status, data } = response;
      yield put({
        type: 'saveAccountOperationInfo',
        payload: {
          status,
          data,
        },
      });
    },

    *queryAccountTypes({ payload }, { call, put }) {
      const response = yield call(queryAccountTypes, payload);
      const { status, data } = response;

      yield put({
        type: 'saveAccountTypes',
        payload: {
          status,
          data,
        },
      });
    },

    *queryIPOSubscriptions({ payload }, { call, put }) {
      const response = yield call(queryIPOSubscriptions, payload);
      const { status, data } = response;

      yield put({
        type: 'saveIPOSubScriptions',
        payload: {
          status,
          data,
        },
      });
    },

    *queryStocks({ payload }, { call, put }) {
      const response = yield call(queryStocks, payload);
      const { status, data } = response;

      yield put({
        type: 'saveStocks',
        payload: {
          status,
          data,
        },
      });
    },

    *addPlan({ payload }, { call, put }) {
      const response = yield call(addPlan, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIpoSign',
        payload: {
          status,
          data,
        },
      });
    },

    *removePlan({ payload }, { call, put }) {
      const response = yield call(removePlan, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIpoSign',
        payload: {
          status,
          data,
        },
      });
    },

    *importData({ payload }, { call, put }) {
      const response = yield call(importData, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIPOSubScriptions',
        payload: {
          status,
          data,
        },
      });
    },

    *ipo({ payload }, { call, put }) {
      const response = yield call(ipo, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIpoSign',
        payload: {
          status,
          data,
        },
      });
    },

    *sign({ payload }, { call, put }) {
      const response = yield call(sign, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIpoSign',
        payload: {
          status,
          data,
        },
      });
    },

    *updateIPO({ payload }, { call, put }) {
      const response = yield call(updateIPO, payload);
      const { status, data } = response; //eslint-disable-line

      yield put({
        type: 'saveIpoSign',
        payload: {
          status,
          data,
        },
      });
    },
  },

  reducers: {
    saveMainAccounts(state, action) {
      return {
        ...state,
        mainAccounts: action.payload.data,
      };
    },
    saveSubAccounts(state, action) {
      return {
        ...state,
        subAccounts: action.payload.data,
      };
    },

    saveAccountTypes(state, action) {
      return {
        ...state,
        accountTypes: action.payload.data,
      };
    },

    saveIPOSubScriptions(state, action) {
      return {
        ...state,
        ipoSubscriptions: action.payload.data,
      };
    },

    saveIpoSign(state, action) {
      const { ipoSubscriptions } = state;
      const p = action.payload.data;
      const list = ipoSubscriptions.map(item => {
        if (item.id === p.id) {
          return p;
        }
        return item;
      });
      return { ...state, ipoSubscriptions: list };
    },

    saveAccountOperationInfo(state, action) {
      const { subAccounts } = state;
      const p = action.payload.data;
      const list = subAccounts.map(item => {
        if (item.id === p.id) {
          return p;
        }
        return item;
      });
      return { ...state, subAccounts: list };
    },

    setProcessing(state, action) {
      const { subAccounts } = state;
      const p = action.payload.data;

      p.lastOperationStatus = 2;
      const list = subAccounts.map(item => {
        if (item.id === p.id) {
          return p;
        }
        return item;
      });
      return { ...state, subAccounts: list };
    },

    saveStocks(state, action) {
      return {
        ...state,
        stocks: action.payload.data,
      };
    },
  },
};
