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
  addFinanceIPO,
  cancelFinanceIPO,
  sign,
  updateIPO,
  addTrans,
  importData,
  installApp,
  closeTrans,
  executeTrans,
  dayEndClearing,
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

    *logon({ payload }, { call, put }) {
      const response = yield call(logon, payload);
      const { status, data } = response;
      yield put({
        type: 'saveAccountOperationInfo',
        payload: {
          status,
          data,
        },
      });
    },

    *executeTrans({ payload }, { call }) {
      yield call(executeTrans, payload);
      // const response = yield call(logon, payload);
      // const { data } = response;
      // console.log(data);
    },

    *dayEndClearing({ payload }, { call }) {
      yield call(dayEndClearing, payload);
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

    *addPlan({ payload }, { call, put }) {
      const response = yield call(addPlan, payload);
      const { status, data } = response; //eslint-disable-line

      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
    },

    *removePlan({ payload }, { call, put }) {
      const response = yield call(removePlan, payload);
      const { status, data } = response; //eslint-disable-line
      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
    },

    *ipo({ payload }, { call, put }) {
      const response = yield call(ipo, payload);
      const { status, data } = response; //eslint-disable-line
      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
    },

    *addFinanceIPO({ payload }, { call, put }) {
      const response = yield call(addFinanceIPO, payload);
      const { status, data } = response; //eslint-disable-line
      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
    },

    *cancelFinanceIPO({ payload }, { call, put }) {
      const response = yield call(cancelFinanceIPO, payload);
      const { status, data } = response; //eslint-disable-line
      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
    },

    *sign({ payload }, { call, put }) {
      const response = yield call(sign, payload);
      const { status, data } = response; //eslint-disable-line
      if (status === 'ok') {
        yield put({
          type: 'saveIpoSign',
          payload: {
            status,
            data,
          },
        });
      } else {
        // fail失败；
        yield put({
          type: 'saveIpoSignFailed',
          payload,
        });
      }
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

    setIPOProcessing(state, action) {
      const { ipoSubscriptions } = state;
      let p = action.payload.data;

      p = { ...p, lastOperationStatus: 2 };
      const list = ipoSubscriptions.map(item => {
        if (item.id === p.id) {
          return p;
        }
        return item;
      });
      return { ...state, ipoSubscriptions: list };
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
      p.lastOperationStatus = '1';
      const list = ipoSubscriptions.map(item => {
        if (item.id === p.id) {
          return p;
        }
        return item;
      });
      return { ...state, ipoSubscriptions: list };
    },

    saveIpoSignFailed(state, action) {
      const { ipoSubscriptions } = state;
      const { id } = action.payload;
      const list = ipoSubscriptions.map(item => {
        if (item.id === id) {
          return { ...item, lastOperationStatus: '0' };
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
