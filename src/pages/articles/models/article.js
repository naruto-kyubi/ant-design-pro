import {
  queryArticleList,
  queryArticleById,
  addArticle,
  queryCatalog,
  queryCommentList,
  addCommnet,
} from '../services/article';

export default {
  namespace: 'article',
  state: {
    articleList: {}, // one page articles
    articlePool: [], // all articles from server
    articleDetail: {}, // one article
    catalog: {},
    commentList: {},
    commentPool: [],
  },
  effects: {
    *fetchArticleList({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      yield put({
        type: 'setArticleList',
        payload: response,
      });
    },

    *fetchCommentList({ payload }, { call, put }) {
      const response = yield call(queryCommentList, payload);
      yield put({
        type: 'setCommentList',
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

    *addComment({ payload }, { call, put }) {
      yield call(addCommnet, payload);

      const { articleId } = payload;
      const response = yield call(queryCommentList, {
        articleId_equal: articleId,
        sorter: 'updatedAt_desc',
      });
      yield put({
        type: 'setCommentList',
        payload: response,
      });
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

    setCommentList(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;
      const commentPool =
        current === 1 ? [...action.payload.data] : [...state.commentPool, ...action.payload.data];

      return {
        ...state,
        commentList: action.payload,
        commentPool,
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
