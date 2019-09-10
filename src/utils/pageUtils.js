export function setPageQueryState(state, action, param) {
  const {
    meta: {
      pagination: { current },
    },
  } = action.payload;
  const articles =
    current === 1 ? [...action.payload.data] : [...state[param].data, ...action.payload.data];
  return { ...state, [param]: { ...action.payload, data: articles } };
}

export function test() {}
