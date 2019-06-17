import {
  queryArticleList,
  queryArticleById,
  addArticle,
  queryCatalog,
  queryCommentList,
  addCommnet,
  queryArticleLikeById,
  addLike,
  deleteLike,
  queryArticleStarById,
  addStar,
  deleteStar,
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
    like: {},
    star: {},
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
      const response = yield call(queryCatalog, payload);
      yield put({
        type: 'setState',
        payload: { catalog: response },
      });
    },

    *fetchArticleById({ payload }, { call, put }) {
      const response = yield call(queryArticleById, payload);
      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
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

    *fetchArticleLikeById({ payload }, { call, put }) {
      const response = yield call(queryArticleLikeById, payload);
      yield put({
        type: 'setState',
        payload: { like: response },
      });
    },

    *addLike({ payload }, { call, put }) {
      const response = yield call(addLike, payload);
      yield put({
        type: 'setState',
        payload: { like: response },
      });
    },

    *deleteLike({ payload }, { call, put }) {
      const response = yield call(deleteLike, payload);
      yield put({
        type: 'setState',
        payload: { like: response },
      });
    },

    *fetchArticleStarById({ payload }, { call, put }) {
      const response = yield call(queryArticleStarById, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },

    *addStar({ payload }, { call, put }) {
      const response = yield call(addStar, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },

    *deleteStar({ payload }, { call, put }) {
      const response = yield call(deleteStar, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setState2(state, action) {
      return { ...state, ...action.payload };
    },

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
  },
};
