import { searchall, searchlike } from '@/pages/search/services/search';

export default {
  namespace: 'search',

  state: {
    searchs: {},
    searchlikes: [],
  },

  effects: {
    *searchall({ payload }, { call, put }) {
      const response = yield call(searchall, payload);
      yield put({
        type: 'setSearchAll',
        payload: response,
      });
    },

    *searchlike({ payload }, { call, put }) {
      const response = yield call(searchlike, payload);
      const { data } = response;
      yield put({
        type: 'setState',
        payload: {
          searchlikes: data,
        },
      });
    },

    //   *addFollows({ payload, callback }, { call, put }) {
    //     const response = yield call(addFollow, payload);

    //     yield put({
    //       type: 'setAddFollows',
    //       payload: response,
    //     });
    //     if (callback) callback(response);
    //   },

    //   *deleteFollows({ payload, callback }, { call, put }) {
    //     const response = yield call(deleteFollow, payload);

    //     const { status } = response;
    //     if (status === 'ok') {
    //       yield put({
    //         type: 'setDeleteFollows',
    //         payload,
    //       });
    //     }

    //     if (callback) callback(response);
    //   },

    //   *addFollow({ payload, callback }, { call, put }) {
    //     const response = yield call(addFollow, payload);
    //     yield put({
    //       type: 'setState',
    //       payload: { follow: response },
    //     });
    //     if (callback) callback(response);
    //   },

    //   *deleteFollow({ payload, callback }, { call, put }) {
    //     const response = yield call(deleteFollow, payload);
    //     yield put({
    //       type: 'setState',
    //       payload: { follow: response },
    //     });
    //     if (callback) callback(response);
    //   },
  },

  reducers: {
    setState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },

    setSearchAll(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        searchs: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        searchs: { ...action.payload, data: d },
      };
    },

    //   setAddFollows(state, action) {
    //     // currentuser new add follow；
    //     const { data } = action.payload;
    //     const {
    //       followUser: { id },
    //       mutual,
    //     } = data;

    //     const f = state.searchs.data.map(item => {
    //       let it = item;
    //       if (it.id === id) {
    //         it = { ...it, mutual };
    //       }
    //       return it;
    //     });

    //     return {
    //       ...state,
    //       searchs: { ...state.searchs, data: f },
    //     };
    //   },

    //   setDeleteFollows(state, action) {
    //     const { id } = action.payload;
    //     const f = state.searchs.data.map(item => {
    //       let it = item;
    //       if (it.id === id) {
    //         it = { ...it, mutual: 'none' };
    //       }
    //       return it;
    //     });

    //     return {
    //       ...state,
    //       searchs: { ...state.follows, data: f },
    //     };
    //   },
  },
};
