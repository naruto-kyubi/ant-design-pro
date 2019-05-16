import { getForgotpasswordCaptcha, resetPassword } from '@/services/api';

export default {
  namespace: 'forgotpassword',

  state: {
    status: undefined,
    data: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(resetPassword, payload);
      const { status, data } = response;
      yield put({
        type: 'resetPasswordHandle',
        payload: {
          status,
          data,
        },
      });
    },

    *getForgotpasswordCaptcha({ payload }, { call }, { put }) {
      const { mobile } = payload;
      const response = yield call(getForgotpasswordCaptcha, mobile);

      const { status, data } = response;
      yield put({
        type: 'captchaHandler',
        payload: {
          status,
          data,
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

    resetPasswordHandler(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
