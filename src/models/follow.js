import {
  queryFollows,
  queryFollow,
  addFollow,
  deleteFollow,
  queryFans,
  search,
} from '@/services/follow';
import { setPageQueryState } from '@/utils/pageUtils';

export default {
  namespace: 'follow',

  state: {
    fanList: {},
    followList: {},
    follow: {},
  },

  effects: {
    *fetchFollows({ payload }, { call, put }) {
      const response = yield call(queryFollows, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'followList' },
      });
    },

    *addFollows({ payload, callback }, { call, put }) {
      const response = yield call(addFollow, payload);

      yield put({
        type: 'setAddFollows',
        payload: response,
      });
      if (callback) callback(response);
    },

    *deleteFollows({ payload, callback }, { call, put }) {
      const response = yield call(deleteFollow, payload);

      const { status } = response;
      if (status === 'ok') {
        yield put({
          type: 'setDeleteFollows',
          payload,
        });
      }

      if (callback) callback(response);
    },

    *fetchFans({ payload }, { call, put }) {
      const response = yield call(queryFans, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'fanList' },
      });
    },

    *addFans({ payload, callback }, { call, put }) {
      const response = yield call(addFollow, payload);

      yield put({
        type: 'setAddFans',
        payload: response,
      });
      if (callback) callback(response);
    },

    *deleteFans({ payload, callback }, { call, put }) {
      const response = yield call(deleteFollow, payload);

      const { status } = response;
      if (status === 'ok') {
        yield put({
          type: 'setDeleteFans',
          payload,
        });
      }

      if (callback) callback(response);
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

    *addFollow({ payload, callback }, { call, put }) {
      const response = yield call(addFollow, payload);
      yield put({
        type: 'setState',
        payload: { follow: response },
      });
      if (callback) callback(response);
    },

    *deleteFollow({ payload, callback }, { call, put }) {
      const response = yield call(deleteFollow, payload);
      yield put({
        type: 'setState',
        payload: { follow: response },
      });
      if (callback) callback(response);
    },

    *search({ payload }, { call, put }) {
      const response = yield call(search, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'followList' },
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

    setPageQueryListState(state, action) {
      const { property } = action.meta;
      return setPageQueryState(state, action, property);
    },

    setAddFollows(state, action) {
      // currentuser new add follow；
      const { data } = action.payload;
      const {
        followUser: { id },
        mutual,
      } = data;

      const f = state.followList.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual };
        }
        return it;
      });

      return {
        ...state,
        followList: { ...state.followList, data: f },
      };
    },

    setDeleteFollows(state, action) {
      const { id } = action.payload;
      const f = state.followList.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual: 'none' };
        }
        return it;
      });

      return {
        ...state,
        followList: { ...state.followList, data: f },
      };
    },

    setAddFans(state, action) {
      const { data } = action.payload;
      const {
        followUser: { id },
        mutual,
      } = data;

      const f = state.fanList.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual };
        }
        return it;
      });

      return {
        ...state,
        fanList: { ...state.fanList, data: f },
      };
    },

    setDeleteFans(state, action) {
      const { id } = action.payload;
      const f = state.fanList.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual: 'none' };
        }
        return it;
      });

      return {
        ...state,
        fanList: { ...state.fanList, data: f },
      };
    },
  },
};
