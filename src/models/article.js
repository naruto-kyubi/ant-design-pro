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
import { setPageQueryState } from '@/utils/pageUtils';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'article',
  state: {
    articleList: {},
    articleDetail: {},
    draftList: {},
    hotList: [],
    user2ArticleList: [],
    followArticleList: {},
    catalog: {},
    commentList: {},
    tag: {},
  },

  effects: {
    *fetchArticleList({ payload }, { call, put }) {
      const response = yield call(queryArticleList, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'articleList' },
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
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'followArticleList' },
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

      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'user2ArticleList' },
      });
    },

    *fetchCommentList({ payload }, { call, put }) {
      const response = yield call(queryCommentList, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'commentList' },
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

      yield put({
        type: 'setState',
        payload: {
          articleDetail: response,
        },
      });

      if (callback) {
        callback(response);
      }
    },

    *saveArticle({ payload, callback }, { call, put }) {
      const response = yield call(saveArticle, payload);

      const {
        data: { id, status, error },
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

      if (callback) callback(status, error);
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

    setPageQueryListState(state, action) {
      const { property } = action.meta;
      return setPageQueryState(state, action, property);
    },

    setComment(state, action) {
      const {
        data: { articleId },
      } = action.payload;
      let comments;
      let newMeta;
      const { data, meta } = state.commentList;
      if (articleId) {
        const { pagination } = meta;
        const newTotal = pagination.total + 1;
        newMeta = { ...meta, pagination: { ...pagination, total: newTotal } };
        comments = [action.payload.data, ...data];
      } else {
        const commentParent = action.payload.data.replyId;
        comments = state.commentList.data.map(item => {
          if (item.id === commentParent) {
            item.children.push(action.payload.data);
          }
          return item;
        });
      }
      return {
        ...state,
        commentList: { ...state.commentList, data: comments, meta: newMeta || meta },
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
