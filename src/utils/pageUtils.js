export function setPageQueryState(state, action, param) {
  const {
    meta: {
      pagination: { current },
    },
  } = action.payload;
  const list =
    current === 1 ? [...action.payload.data] : [...state[param].data, ...action.payload.data];
  return { ...state, [param]: { ...action.payload, data: list } };
}

export function hasMorePage(list) {
  const { meta } = list;
  return meta ? meta.pagination.current * meta.pagination.pageSize < meta.pagination.total : false;
}

export function getNextPage(list, isFirst) {
  const { meta } = list;
  let current = meta ? meta.pagination.current + 1 : 1;
  current = isFirst ? 1 : current;
  return current;
}
