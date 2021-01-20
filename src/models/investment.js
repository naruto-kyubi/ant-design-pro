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
  ipo,
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

    *addAccount({ payload }, { call }) {
      yield call(addAccount, payload);
      // const response = yield call(addAccount, payload);
      // const {  data } = response;
      // console.log(payload);
    },

    *updateAccount({ payload }, { call }) {
      yield call(updateAccount, payload);
      // const response = yield call(updateAccount, payload);
      // const { status, data } = response;
      // console.log(payload);
    },

    *queryBalance({ payload }, { call }) {
      yield call(queryBalance, payload);
      // const response = yield call(queryBalance, payload);
      // const { status, data } = response;
      // console.log(data);
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

    *ipo({ payload }, { call }) {
      const response = yield call(ipo, payload);
      const { status, data } = response; //eslint-disable-line

      // yield put({
      //   type: 'saveStocks',
      //   payload: {
      //     status,
      //     data,
      //   },
      // });
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

    saveStocks(state, action) {
      return {
        ...state,
        stocks: action.payload.data,
      };
    },
  },
};
