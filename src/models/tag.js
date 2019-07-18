import { queryAllTags, queryUserTags, addTag, deleteTag } from '@/pages/tags/services/tag';

export default {
  namespace: 'tag',

  state: {
    tags: {},
  },

  effects: {
    *fetchAllTags({ payload }, { call, put }) {
      const response = yield call(queryAllTags, payload);
      yield put({
        type: 'setFetchAll',
        payload: response,
      });
    },

    *fetchUserTags({ payload }, { call, put }) {
      const response = yield call(queryUserTags, payload);
      yield put({
        type: 'setFetchAll',
        payload: response,
      });
    },

    *addTag({ payload, callback }, { call, put }) {
      const response = yield call(addTag, payload);
      yield put({
        type: 'setAddTag',
        payload: response,
      });
      if (callback) callback(response);
    },

    *deleteTag({ payload, callback }, { call, put }) {
      const response = yield call(deleteTag, payload);
      const { tagId } = payload;
      yield put({
        type: 'setDeleteTag',
        payload: { id: tagId },
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

    setFetchAll(state, action) {
      const {
        meta: {
          pagination: { current },
        },
      } = action.payload;

      const {
        tags: { data },
      } = state;
      const d = current === 1 ? [...action.payload.data] : [...data, ...action.payload.data];

      return {
        ...state,
        tags: { ...action.payload, data: d },
      };
    },

    setAddTag(state, action) {
      // currentuser new add follow；
      const { data } = action.payload;
      const {
        tag: { id },
        userId,
      } = data;

      const f = state.tags.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, userId };
        }
        return it;
      });

      return {
        ...state,
        tags: { ...state.tags, data: f },
      };
    },

    setDeleteTag(state, action) {
      const { id } = action.payload;
      const f = state.tags.data.map(item => {
        let it = item;
        if (it.id === id) {
          it = { ...it, userId: undefined };
        }
        return it;
      });

      return {
        ...state,
        tags: { ...state.tags, data: f },
      };
    },
  },
};
