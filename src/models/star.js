import {
  queryArticleStarById,
  queryStarList,
  addStar,
  deleteStar,
} from '@/pages/articles/services/star';

export default {
  namespace: 'star',
  state: {
    // starList: {},
    // starPool: [],
    stars: {},
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
        type: 'setStars',
        payload: response,
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

    setStars(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        stars: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        stars: { ...action.payload, data: d },
      };

      //   const {
      //     meta: {
      //       pagination: { current },
      //     },
      //   } = action.payload;
      //   const starPool =
      //     current === 1 ? [...action.payload.data] : [...state.starPool, ...action.payload.data];

      //   return {
      //     ...state,
      //     starList: action.payload,
      //     starPool,
      //   };
    },
  },
};
