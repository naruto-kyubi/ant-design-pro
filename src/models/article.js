import {
  queryArticleList,
  queryArticleById,
  saveArticle,
  deleteArticle,
  queryCatalog,
  queryCommentList,
  addCommnet,
  queryTag,
  querySearchList,
  queryHotList,
  querUser2ArticleList,
  queryFollowArticleList,
  queryDraftList,
  queryDraftById,
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
    user2ArticleList: [],
    followArticleList: {},
    catalog: {},
    commentList: {},
    commentPool: [],
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

    *deleteArticle({ payload }, { call, put }) {
      const response = yield call(deleteArticle, payload);
      yield put({
        type: 'delDraft',
        payload: response.data,
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

    *fetchUser2ArticleList({ payload }, { call, put }) {
      const response = yield call(querUser2ArticleList, payload);
      const { data } = response;
      yield put({
        type: 'setState',
        payload: {
          user2ArticleList: data,
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

      const {
        data: { id, status },
      } = response;

      if (status === 'publish') {
        yield put(routerRedux.replace(`/articles/${id}`));
      }

      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
      });
    },

    *editArticle({ payload }, { call, put }) {
      const response = yield call(queryDraftById, payload);
      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
      });
      yield put(routerRedux.replace(`/articles/edit`));
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

    delDraft(state, action) {
      const {
        draftList: { data, meta },
      } = state;
      const { pagination } = meta;
      const newData = data.filter(item => item.id !== action.payload);
      const newTotal = pagination.total - 1;
      const newMeta = { ...meta, pagination: { ...pagination, total: newTotal } };
      return {
        ...state,
        draftList: { ...state.draftList, data: newData, meta: newMeta },
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
