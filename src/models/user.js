import {
  addUser,
  removeUser,
  updateUser,
  queryUser,
  bind,
  unbind,
  queryBinds,
} from '@/services/api';
import { queryCurrent } from '@/services/user';

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
    binds: [],
  },

  effects: {
    // *fetch(_, { call, put }) {
    //   const response = yield call(queryUsers);
    //   yield put({
    //     type: 'save',
    //     payload: response,
    //   });
    // },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      const { data } = response;
      yield put({
        type: 'saveCurrentUser',
        payload: data,
      });
    },

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
      if (callback) callback(status);
    },

    *bind({ payload }, { call, put, select }) {
      const response = yield call(bind, payload);
      const { status, data } = response;

      const v = yield select(_ => _.user.binds);
      // const v = yield select(state => state.binds)

      // const _catalog2newsList = yield select( state => state.list.catalog2NewsList);

      if (status === 'ok') {
        // 成功；
        yield put({
          type: 'saveHandle',
          payload: {
            binds: [...v, data],
          },
        });
      }
      // if (callback) callback({ status, data })();
    },

    *unbind({ payload }, { call, put, select }) {
      const response = yield call(unbind, payload);
      const { status } = response;

      if (status === 'ok') {
        const { authType } = payload;
        // const binds = yield select(state=>state.user.binds);
        const b = yield select(_ => _.user.binds);

        const v = b.filter(item => item.authType !== authType);
        // 成功；
        yield put({
          type: 'saveHandle',
          payload: {
            binds: v,
            // status,
            // list: data,
          },
        });
      }
      // if (callback) callback({ status })();
    },

    *queryBinds({ payload }, { call, put }) {
      const response = yield call(queryBinds, payload);
      const { data } = response;

      yield put({
        type: 'saveHandle',
        payload: {
          binds: data,
        },
      });
    },
  },

  reducers: {
    saveHandle(state, action) {
      return {
        ...state,
        ...action.payload,
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
