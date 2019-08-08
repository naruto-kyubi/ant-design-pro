import { register, getRegisterCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { reloadAuthorized } from '@/utils/Authorized';

export default {
  namespace: 'register',

  state: {
    status: undefined,
    data: undefined,
    error: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      // const response = yield call(fakeRegister, payload);
      const response = yield call(register, payload);
      const { status, data, error } = response;
      yield put({
        type: 'registerHandle',
        payload: {
          status,
          data,
          error,
        },
      });
    },

    *getRegisterCaptcha({ payload }, { call, put }) {
      // const response = yield call(fakeRegister, payload);
      const { mobile } = payload;
      const response = yield call(getRegisterCaptcha, mobile);

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
    registerHandle(state, { payload }) {
      setAuthority('user');
      reloadAuthorized();
      return {
        ...state,
        ...payload,
      };
    },
    captchaHandler(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
