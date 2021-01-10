import { queryMainAccounts,logon,queryBalance,queryAccountTypes } from '@/services/investment';



export default {
  namespace: 'investment',

  state: {
    mainAccounts: [],
    accountTypes:[],
  },

  effects: {

    *queryMainAccounts({ payload }, { call, put }) {
      const response = yield call(queryMainAccounts, payload);
      const {
        status,
        data,
      } = response;

      yield put({
        type: 'saveMainAccounts',
        payload: {
          status,
          data,
        },
      });
    },

    *logon({ payload }, { call, put }){
      const response = yield call(logon, payload);
      const {
        status,
        data,
      } = response;
      console.log(data)
    },

    *queryBalance({ payload }, { call, put }){
      const response = yield call(queryBalance, payload);
      const {
        status,
        data,
      } = response;
      console.log(data)
    },

    *queryAccountTypes({ payload }, { call, put }) {
      const response = yield call(queryAccountTypes, payload);
      const {
        status,
        data,
      } = response;

      yield put({
        type: 'saveAccountTypes',
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
        mainAccounts:action.payload.data,
      };
    },

    saveAccountTypes(state, action) {
      return {
        ...state,
        accountTypes:action.payload.data,
      };
    },
  },
};