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

export function pagination(current, pageSize, sorter) {
  let payload = { 'pagination.current': current };

  if (pageSize) {
    payload = { ...payload, 'pagination.pageSize': pageSize };
  }

  if (sorter) {
    payload = { ...payload, 'pagination.sorter': sorter };
  }
  return payload;
}

export function getPaginationPayload(list, isFirst, pageSize, sorter, params) {
  const current = getNextPage(list, isFirst);
  const page = pagination(current, pageSize, sorter);
  return { ...page, ...params };
}
