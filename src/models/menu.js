import memoizeOne from 'memoize-one';
import isEqual from 'lodash/isEqual';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
// import { menu } from '../defaultSettings';
import { queryMenus } from '@/services/api';

const { check } = Authorized;

// Conversion router to menu.
// function formatter(data, parentAuthority, parentName) {
//   if (!data) {
//     return undefined;
//   }
//   return data
//     .map(item => {
//       if (!item.name || !item.path) {
//         return null;
//       }

//       let locale = 'menu';
//       if (parentName && parentName !== '/') {
//         locale = `${parentName}.${item.name}`;
//       } else {
//         locale = `menu.${item.name}`;
//       }
//       // if enableMenuLocale use item.name,
//       // close menu international
//       const name = menu.disableLocal
//         ? item.name
//         : formatMessage({ id: locale, defaultMessage: item.name });
//       const result = {
//         ...item,
//         name,
//         locale,
//         authority: item.authority || parentAuthority,
//       };
//       if (item.routes) {
//         const children = formatter(item.routes, item.authority, locale);
//         // Reduce memory usage
//         result.children = children;
//       }
//       delete result.routes;
//       return result;
//     })
//     .filter(item => item);
// }

// const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = item => {
  // doc: add hideChildrenInMenu
  if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
    return {
      ...item,
      children: filterMenuData(item.children), // eslint-disable-line
    };
  }
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = menuData => {
  if (!menuData) {
    return [];
  }
  return menuData
    .filter(item => item.name && !item.hideInMenu)
    .map(item => check(item.authority, getSubMenu(item)))
    .filter(item => item);
};
/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = menuData => {
  if (!menuData) {
    return {};
  }
  const routerMap = {};

  const flattenMenuData = data => {
    data.forEach(menuItem => {
      if (menuItem.children) {
        flattenMenuData(menuItem.children);
      }
      // Reduce memory usage
      routerMap[menuItem.path] = menuItem;
    });
  };
  flattenMenuData(menuData);
  return routerMap;
};

const memoizeOneGetBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);

export default {
  namespace: 'menu',

  state: {
    menuData: [],
    components: [],
    routerData: [],
    breadcrumbNameMap: {},
  },

  effects: {
    // *getMenuData({ payload }, { put }) {
    //   const { routes, authority, path } = payload;
    //   const originalMenuData = memoizeOneFormatter(routes, authority, path);
    //   const menuData = filterMenuData(originalMenuData);
    //   const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(originalMenuData);
    //   yield put({
    //     type: 'save',
    //     payload: { menuData, breadcrumbNameMap, routerData: routes },
    //   });
    // },
    //     function compare(property){
    //       return function(obj1,obj2){
    //           var value1 = obj1[property];
    //           var value2 = obj2[property];
    //           return value1 - value2;     // 升序
    //       }
    //  }

    *getMenuData({ payload }, { call, put }) {
      // const { routes, authority, path } = payload;
      const { routes } = payload;
      // 读取服务端，获取Menu数据；@liuhaoyi
      const response = yield call(queryMenus);
      // Login successfully
      if (response.status === 'ok') {
        const originalMenuData = response.data;

        // 递归函数，遍历菜单数据，并且支持多语言。
        const localeMenuData = data => {
          const menuData = [...data].sort((obj1, obj2) => {
            return obj1.seq - obj2.seq;
          });
          const newData = menuData.map(item => {
            let menuItem = { ...item };

            if (item.locale) {
              menuItem = {
                ...item,
                name: formatMessage({ id: item.locale, defaultMessage: item.name }),
              };
            }
            if (item.children) {
              const itemFilter = localeMenuData(item.children).filter(
                obj => !(obj.type === 'COMPONENT')
              );
              menuItem = { ...menuItem, children: itemFilter };
            }
            return menuItem;
          });
          return newData;
        };

        const localeCOMData = data => {
          const comData = [...data];
          let comItem = [];
          comData.map(item => {
            if (item.type === 'COMPONENT') {
              comItem = [...comItem, item];
            }
            if (item.children) {
              const c = localeCOMData(item.children);
              if (c) comItem = [...comItem, ...c];
            }
            return comItem;
          });
          return comItem;
        };

        const myOriginalMenuData = localeMenuData(originalMenuData);
        const myOriginalCOMData = localeCOMData(originalMenuData);

        // 注释掉原有的在router.config.js中获取菜单的功能。
        // const originalMenuData = memoizeOneFormatter(routes, authority, path);
        const menuData = filterMenuData(myOriginalMenuData);
        const breadcrumbNameMap = memoizeOneGetBreadcrumbNameMap(myOriginalMenuData);
        yield put({
          type: 'save',
          payload: {
            menuData,
            breadcrumbNameMap,
            components: myOriginalCOMData,
            routerData: routes,
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      // stored data into window；
      window.authorizeComponents = action.payload.components;
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
