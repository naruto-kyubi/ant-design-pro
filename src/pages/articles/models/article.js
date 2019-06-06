import { queryList, queryById, add } from '../services/article';

export default {
  namespace: 'article',
  state: {
    list: [],
    content: null,
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *fetch({ payload }, { call, put }) {
      const response = yield call(queryById, payload);
      yield put({
        type: 'queryById',
        payload: response,
      });
    },

    *add({ payload }, { call }) {
      yield call(add, payload);
    },
  },
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    queryById(state, action) {
      return {
        ...state,
        content: action.payload,
      };
    },
  },
};
