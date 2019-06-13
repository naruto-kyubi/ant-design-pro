import { queryArticleList, queryArticleById, addArticle, queryCatalog } from '../services/article';

export default {
  namespace: 'article',
  state: {
    articleList: {}, // one page articles
    articlePool: [], // all articles from server
    articleDetail: {}, // one article
    catalog: {},
  },
  effects: {
    *fetchArticleList({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      yield put({
        type: 'setArticleList',
        payload: response,
      });
    },

    *fetchCatalog({ payload }, { call, put }) {
      const reponse = yield call(queryCatalog, payload);
      yield put({
        type: 'setCatalog',
        payload: reponse,
      });
    },

    *fetchArticleById({ payload }, { call, put }) {
      const response = yield call(queryArticleById, payload);
      yield put({
        type: 'setArticleDetail',
        payload: response,
      });
    },

    *addArticle({ payload }, { call }) {
      yield call(addArticle, payload);
    },
  },
  reducers: {
    setArticleList(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;
      const articlePool =
        current === 1 ? [...action.payload.data] : [...state.articlePool, ...action.payload.data];

      return {
        ...state,
        articleList: action.payload,
        articlePool,
      };
    },

    setCatalog(state, action) {
      return {
        ...state,
        catalog: action.payload,
      };
    },

    setArticleDetail(state, action) {
      return {
        ...state,
        articleDetail: action.payload,
      };
    },
  },
};
