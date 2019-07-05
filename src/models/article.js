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
  queryStarList,
  addStar,
  deleteStar,
  queryTag,
  querySearchList,
} from '@/pages/articles/services/article';

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

    *addArticle({ payload }, { call }) {
      yield call(addArticle, payload);
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
