import { queryFollows, queryFollow, addFollow, deleteFollow, queryFans } from '@/services/follow';

export default {
  namespace: 'follow',

  state: {
    fans: {},
    follows: {},

    follow: {},
  },

  effects: {
    *fetchFollows({ payload }, { call, put }) {
      const response = yield call(queryFollows, payload);
      yield put({
        type: 'setFetchFollows',
        payload: response,
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
        type: 'setFetchFans',
        payload: response,
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
  },

  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    setFetchFollows(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        follows: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        follows: { ...action.payload, data: d },
      };
    },

    setAddFollows(state, action) {
      // currentuser new add follow；
      const { data } = action.payload;
      const {
        followUser: { id },
        mutual,
      } = data;

      const f = state.follows.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual };
        }
        return it;
      });

      return {
        ...state,
        follows: { ...state.follows, data: f },
      };
    },

    setDeleteFollows(state, action) {
      const { id } = action.payload;
      const f = state.follows.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual: 'none' };
        }
        return it;
      });

      return {
        ...state,
        follows: { ...state.follows, data: f },
      };
    },

    setFetchFans(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        fans: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        fans: { ...action.payload, data: d },
      };
    },

    setAddFans(state, action) {
      const { data } = action.payload;
      const {
        followUser: { id },
        mutual,
      } = data;

      const f = state.fans.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual };
        }
        return it;
      });

      return {
        ...state,
        fans: { ...state.follows, data: f },
      };
    },

    setDeleteFans(state, action) {
      const { id } = action.payload;
      const f = state.fans.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, mutual: 'none' };
        }
        return it;
      });

      return {
        ...state,
        fans: { ...state.follows, data: f },
      };
    },
  },
};
