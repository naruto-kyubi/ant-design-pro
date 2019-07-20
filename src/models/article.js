import {
  queryArticleList,
  queryArticleById,
  saveArticle,
  queryCatalog,
  queryCommentList,
  addCommnet,
  queryArticleLikeById,
  addLike,
  deleteLike,
  queryArticleStarById,
  queryStarList,
  addStar,
  deleteStar,
  queryTag,
  querySearchList,
  queryHotList,
  queryFollowArticleList,
  queryDraftList,
} from '@/pages/articles/services/article';

import { routerRedux } from 'dva/router';

export default {
  namespace: 'article',
  state: {
    articleList: {}, // one page articles
    articlePool: [], // all articles from server
    articleDetail: {}, // one article
    draftList: {},
    hotList: [],
    followArticleList: {},
    catalog: {},
    commentList: {},
    commentPool: [],
    like: {},
    starList: {},
    starPool: [],

    star: {},
    // follow: {},
    tag: {},
  },

  effects: {
    *fetchArticleList({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      yield put({
        type: 'setArticleList',
        payload: response,
      });
    },

    *fetchFollowArticleList({ payload }, { call, put }) {
      const response = yield call(queryFollowArticleList, payload);
      yield put({
        type: 'setFollowArticleList',
        payload: response,
      });
    },

    *fetchDraftList({ payload }, { call, put }) {
      const response = yield call(queryDraftList, payload);
      yield put({
        type: 'setState',
        payload: {
          draftList: response,
        },
      });
    },

    *fetchHotList({ payload }, { call, put }) {
      const response = yield call(queryHotList, payload);
      const { data } = response;
      yield put({
        type: 'setState',
        payload: {
          hotList: data,
        },
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

    *fetchTag({ payload }, { call, put }) {
      const response = yield call(queryTag, payload);
      yield put({
        type: 'setState',
        payload: { tag: response },
      });
    },

    *fetchArticleById({ payload, callback }, { call, put }) {
      const response = yield call(queryArticleById, payload);

      if (callback) {
        callback(response);
      }

      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
      });
    },

    *saveArticle({ payload }, { call, put }) {
      const response = yield call(saveArticle, payload);

      // const {
      //   data: { id },
      // } = response;
      //    yield put(routerRedux.replace(`/articles/${id}`));
      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
      });
    },

    // eslint-disable-next-line no-unused-vars
    *new({ payload }, { put }) {
      yield put({
        type: 'setState',
        payload: {
          articleDetail: {},
        },
      });
      yield put(routerRedux.replace(`/articles/edit`));
    },

    *addComment({ payload }, { call, put }) {
      const response = yield call(addCommnet, payload);
      yield put({
        type: 'setComment',
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

    *fetchStarList({ payload }, { call, put }) {
      const response = yield call(queryStarList, payload);
      yield put({
        type: 'setStarList',
        payload: response,
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

    *fetchSearchList({ payload }, { call, put }) {
      const response = yield call(querySearchList, payload);
      yield put({
        type: 'setArticleList',
        payload: response,
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

    setFollowArticleList(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        followArticleList: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        followArticleList: { ...action.payload, data: d },
      };
    },

    setStarList(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;
      const starPool =
        current === 1 ? [...action.payload.data] : [...state.starPool, ...action.payload.data];

      return {
        ...state,
        starList: action.payload,
        starPool,
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

    setComment(state, action) {
      const {
        data: { articleId },
      } = action.payload;
      if (articleId)
        return {
          ...state,
          commentPool: [action.payload.data, ...state.commentPool],
        };

      const commentParent = action.payload.data.replyId;
      const newCommentPool = state.commentPool.map(item => {
        if (item.id === commentParent) {
          item.children.push(action.payload.data);
        }
        return item;
      });
      return {
        ...state,
        commentPool: newCommentPool,
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
