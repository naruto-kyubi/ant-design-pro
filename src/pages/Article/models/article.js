import { queryArticles, addArticle } from '../services/article';

export default {
  namespace: 'article',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryArticles, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *add({ payload }, { call }) {
      yield call(addArticle, payload);
    },
  },
  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
  },
};
