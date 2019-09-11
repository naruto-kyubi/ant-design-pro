import {
  queryArticleStarById,
  queryStarList,
  addStar,
  deleteStar,
} from '@/pages/articles/services/star';
import { setPageQueryState } from '@/utils/pageUtils';

export default {
  namespace: 'star',
  state: {
    starList: {},
    star: {},
  },

  effects: {
    *fetchArticleStarById({ payload }, { call, put }) {
      const response = yield call(queryArticleStarById, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },

    *fetchStarList({ payload }, { call, put }) {
      const response = yield call(queryStarList, payload);
      yield put({
        type: 'setPageQueryListState',
        payload: response,
        meta: { property: 'starList' },
      });
    },

    *addStar({ payload }, { call, put }) {
      const response = yield call(addStar, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },

    *deleteStar({ payload }, { call, put }) {
      const response = yield call(deleteStar, payload);
      yield put({
        type: 'setState',
        payload: { star: response },
      });
    },
  },

  reducers: {
    setState(state, action) {
      return { ...state, ...action.payload };
    },

    setPageQueryListState(state, action) {
      const { property } = action.meta;
      return setPageQueryState(state, action, property);
    },
  },
};
