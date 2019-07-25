import { queryProvince, queryCity } from '@/services/geographic';

export default {
  namespace: 'geographic',

  state: {
    province: [],
    city: [],
    isLoading: false,
  },

  effects: {
    *fetchProvince(_, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryProvince);
      const { data } = response;
      yield put({
        type: 'setProvince',
        payload: data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },

    *fetchCity({ payload }, { call, put }) {
      yield put({
        type: 'changeLoading',
        payload: true,
      });
      const response = yield call(queryCity, payload);
      const { data } = response;
      yield put({
        type: 'setCity',
        payload: data,
      });
      yield put({
        type: 'changeLoading',
        payload: false,
      });
    },
  },

  reducers: {
    setProvince(state, action) {
      return {
        ...state,
        province: action.payload,
      };
    },
    setCity(state, action) {
      return {
        ...state,
        city: action.payload,
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};
