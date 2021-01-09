import { queryMainAccounts,logon,queryBalance } from '@/services/investment';



export default {
  namespace: 'investment',

  state: {
    mainAccounts: [],
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
    }

  },

  reducers: {
    saveMainAccounts(state, action) {
      return {
        ...state,
        mainAccounts:action.payload.data,
      };
    },
  },
};