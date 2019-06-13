import { queryList, queryById, add, queryCatalog } from '../services/article';

export default {
  namespace: 'article',
  state: {
    list: {},
    catalog: null,
    content: null,
    articleList: [],
  },
  effects: {
    *fetchList({ payload }, { call, put }) {
      const response = yield call(queryList, payload);
      yield put({
        type: 'queryList',
        payload: response,
      });
    },

    *fetchCatalog({ payload }, { call, put }) {
      const reponse = yield call(queryCatalog, payload);
      yield put({
        type: 'queryCatalog',
        payload: reponse,
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
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;
      const articleList =
        current === 1 ? [...action.payload.data] : [...state.articleList, ...action.payload.data];

      return {
        ...state,
        list: action.payload,
        articleList,
      };
    },

    queryCatalog(state, action) {
      return {
        ...state,
        catalog: action.payload,
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
