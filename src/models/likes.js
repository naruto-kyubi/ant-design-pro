import { queryArticleLikeById, addLike, deleteLike } from '@/pages/articles/services/like';

export default {
  namespace: 'like',
  state: {
    like: {},
  },

  effects: {
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
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
