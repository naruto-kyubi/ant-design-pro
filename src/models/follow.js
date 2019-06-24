import { queryFans, queryFollows, queryFollow, addFollow, deleteFollow } from '@/services/follow';

export default {
  namespace: 'follow',

  state: {
    fans: {},
    follows: {},

    follow: {},
  },

  effects: {
    *fetchFans({ payload }, { call, put }) {
      const response = yield call(queryFans, payload);
      yield put({
        type: 'setState',
        payload: { fans: response },
      });
    },

    *fetchFollows({ payload }, { call, put }) {
      const response = yield call(queryFollows, payload);
      yield put({
        type: 'setState',
        payload: { follows: response },
      });
    },

    *queryFollow({ payload }, { call, put }) {
      const response = yield call(queryFollow, payload);
      //
      yield put({
        type: 'setState',
        payload: {
          follow: response,
        },
      });
    },

    *addFollow({ payload }, { call, put }) {
      const response = yield call(addFollow, payload);
      yield put({
        type: 'setState',
        payload: { follow: response },
      });
    },

    *deleteFollow({ payload }, { call, put }) {
      const response = yield call(deleteFollow, payload);
      yield put({
        type: 'setState',
        payload: { follow: response },
      });
    },
  },

  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
