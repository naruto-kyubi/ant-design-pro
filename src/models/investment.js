import { querySubAccounts,queryMainAccounts,logon,queryBalance,queryAccountTypes,addAccount} from '@/services/investment';



export default {
  namespace: 'investment',

  state: {
    mainAccounts: [],
    subAccounts:[],
    accountTypes:[],
  },

  effects: {

    *querySubAccounts({ payload }, { call, put }) {
      const response = yield call(querySubAccounts, payload);
      const {
        status,
        data,
      } = response;

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

    *addAccount({ payload }, { call, put }){
      const response = yield call(addAccount, payload);
      const {
        status,
        data,
      } = response;
      console.log(payload)
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
    saveSubAccounts(state, action) {
      return {
        ...state,
        subAccounts:action.payload.data,
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