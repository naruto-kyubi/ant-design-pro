import { getForgotpasswordCaptcha, resetPassword } from '@/services/api';
import { routerRedux } from 'dva/router';

export default {
  namespace: 'forgotpassword',

  state: {
    status: undefined,
    data: undefined,
    error: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      const { status, data, error } = response;
      yield put({
        type: 'resetPassword',
        payload: {
          status,
          data,
          error,
        },
      });
      if (status === 'ok') {
        yield put(routerRedux.replace(`/user/login`, { account: data.mobile }));
      }
    },

    *getForgotpasswordCaptcha({ payload }, { call, put }) {
      const { mobile } = payload;
      const response = yield call(getForgotpasswordCaptcha, mobile);

      const { status, data, error } = response;
      yield put({
        type: 'captchaHandler',
        payload: {
          status,
          data,
          error,
        },
      });
    },
  },

  reducers: {
    captchaHandler(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    resetPassword(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
