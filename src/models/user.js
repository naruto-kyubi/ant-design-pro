import { addUser, removeUser, updateUser, queryUser } from '@/services/api';

export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},

    data: {
      status: undefined,
      list: [],
      pagination: {},
    },
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },

    // *fetchCurrent(_, { call, put }) {
    //   const response = yield call(queryCurrent);
    //   yield put({
    //     type: 'saveCurrentUser',
    //     payload: response,
    //   });
    // },

    *query({ payload }, { call, put }) {
      const response = yield call(queryUser, payload);
      const {
        status,
        data,
        meta: { pagination },
      } = response;

      yield put({
        type: 'saveHandle',
        payload: {
          status,
          list: data,
          pagination,
        },
      });
    },

    *create({ payload, callback }, { call, put }) {
      const response = yield call(addUser, payload);

      const { status, data } = response;

      if (status === 'ok') {
        // 成功；
        yield put({
          type: 'saveHandle',
          payload: {
            // status,
            // list: data,
          },
        });
      }
      if (callback) callback({ status, data })();
    },

    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeUser, payload);
      const {
        status,
        // data,
      } = response;

      yield put({
        type: 'saveHandle',
        payload: {
          status,
          // data,
        },
      });
      if (callback) callback();
    },

    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateUser, payload);
      const {
        status,
        // data,
      } = response;

      yield put({
        type: 'saveHandle',
        payload: {
          status,
          // data,
        },
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveHandle(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    },
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
