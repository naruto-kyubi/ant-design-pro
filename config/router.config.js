export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/weibo', name: 'weibo', component: './User/Weibo' },
      // { path: '/user/user', name: 'user', component: './User/User' },
      { path: '/user/login', name: 'login', component: './User/Login' },
      { path: '/user/forgotpassword', name: 'login', component: './User/Forgotpassword' },
      { path: '/user/register', name: 'register', component: './User/Register' },
      {
        path: '/user/register-result',
        name: 'register.result',
        component: './User/RegisterResult',
      },
      {
        component: '404',
      },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      // dashboard
      { path: '/', redirect: '/articles', authority: ['admin', 'user'] },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
          {
            path: '/dashboard/monitor',
            name: 'monitor',
            component: './Dashboard/Monitor',
          },
          {
            path: '/dashboard/workplace',
            name: 'workplace',
            component: './Dashboard/Workplace',
          },
        ],
      },
      // users
      {
        path: '/console/user',
        icon: 'form',
        name: 'user',
        routes: [
          {
            path: '/console/user/user',
            name: 'user',
            component: './User/User',
          },
          // {
          //   path: '/form/advanced-form',
          //   name: 'advancedform',
          //   authority: ['admin'],
          //   component: './Forms/AdvancedForm',
          // },
        ],
      },
      // forms
      {
        path: '/form',
        icon: 'form',
        name: 'form',
        routes: [
          {
            path: '/form/basic-form',
            name: 'basicform',
            component: './Forms/BasicForm',
          },
          {
            path: '/form/step-form',
            name: 'stepform',
            component: './Forms/StepForm',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/form/step-form',
                redirect: '/form/step-form/info',
              },
              {
                path: '/form/step-form/info',
                name: 'info',
                component: './Forms/StepForm/Step1',
              },
              {
                path: '/form/step-form/confirm',
                name: 'confirm',
                component: './Forms/StepForm/Step2',
              },
              {
                path: '/form/step-form/result',
                name: 'result',
                component: './Forms/StepForm/Step3',
              },
            ],
          },
          {
            path: '/form/advanced-form',
            name: 'advancedform',
            authority: ['admin'],
            component: './Forms/AdvancedForm',
          },
        ],
      },
      // list
      {
        path: '/list',
        icon: 'table',
        name: 'list',
        routes: [
          {
            path: '/list/table-list',
            name: 'searchtable',
            component: './List/TableList',
          },
          {
            path: '/list/basic-list',
            name: 'basiclist',
            component: './List/BasicList',
          },
          {
            path: '/list/card-list',
            name: 'cardlist',
            component: './List/CardList',
          },
          {
            path: '/list/search',
            name: 'searchlist',
            component: './List/List',
            routes: [
              {
                path: '/list/search',
                redirect: '/list/search/articles',
              },
              {
                path: '/list/search/articles',
                name: 'articles',
                component: './List/Articles',
              },
              {
                path: '/list/search/projects',
                name: 'projects',
                component: './List/Projects',
              },
              {
                path: '/list/search/applications',
                name: 'applications',
                component: './List/Applications',
              },
            ],
          },
        ],
      },
      {
        path: '/profile',
        name: 'profile',
        icon: 'profile',
        routes: [
          // profile
          {
            path: '/profile/basic',
            name: 'basic',
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/basic/:id',
            name: 'basic',
            hideInMenu: true,
            component: './Profile/BasicProfile',
          },
          {
            path: '/profile/advanced',
            name: 'advanced',
            authority: ['admin'],
            component: './Profile/AdvancedProfile',
          },
        ],
      },
      {
        name: 'result',
        icon: 'check-circle-o',
        path: '/result',
        routes: [
          // result
          {
            path: '/result/success',
            name: 'success',
            component: './Result/Success',
          },
          { path: '/result/fail', name: 'fail', component: './Result/Error' },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        routes: [
          // exception
          {
            path: '/exception/403',
            name: 'not-permission',
            component: './Exception/403',
          },
          {
            path: '/exception/404',
            name: 'not-find',
            component: './Exception/404',
          },
          {
            path: '/exception/500',
            name: 'server-error',
            component: './Exception/500',
          },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/TriggerException',
          },
        ],
      },
      {
        name: 'account',
        icon: 'user',
        path: '/account',
        routes: [
          {
            path: '/account/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/center',
                redirect: '/account/center/articles',
              },
              {
                path: '/account/center/articles',
                component: './Account/Center/Articles',
              },
              {
                path: '/account/center/stars',
                component: './Account/Center/Stars',
              },
              {
                path: '/account/center/follows',
                component: './Account/Center/Follows',
              },
              {
                path: '/account/center/fans',
                component: './Account/Center/Fans',
              },
              {
                path: '/account/center/applications',
                component: './Account/Center/Applications',
              },
              {
                path: '/account/center/projects',
                component: './Account/Center/Projects',
              },
            ],
          },
          {
            path: '/account/settings',
            name: 'settings',
            component: './Account/Settings/Info',
            routes: [
              {
                path: '/account/settings',
                redirect: '/account/settings/base',
              },
              {
                path: '/account/settings/base',
                component: './Account/Settings/BaseView',
              },
              {
                path: '/account/settings/security',
                component: './Account/Settings/SecurityView',
              },
              {
                path: '/account/settings/binding',
                component: './Account/Settings/BindingView',
              },
              {
                path: '/account/settings/notification',
                component: './Account/Settings/NotificationView',
              },
            ],
          },
          {
            path: '/account/users',
            name: 'users',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/account/users/:id?',
                component: './Account/User/$id.js',
              },
            ],
          },
        ],
      },
      //  editor
      {
        name: 'editor',
        icon: 'highlight',
        path: '/editor',
        routes: [
          {
            path: '/editor/flow',
            name: 'flow',
            component: './Editor/GGEditor/Flow',
          },
          {
            path: '/editor/mind',
            name: 'mind',
            component: './Editor/GGEditor/Mind',
          },
          {
            path: '/editor/koni',
            name: 'koni',
            component: './Editor/GGEditor/Koni',
          },
        ],
      },

      {
        path: '/articles',
        name: 'articles',
        routes: [
          // exception
          {
            path: '/articles',
            component: './articles/index.js',
          },
          // {
          //   path: '/articles/follows',
          //   component: './articles/follows.js',
          // },
          {
            path: '/articles/edit/:id?',
            component: './articles/edit.js',
          },
          {
            path: '/articles/:id?',
            component: './articles/$id.js',
          },
        ],
      },
      {
        path: '/investment',
        name: 'investment',
        routes: [
          // exception
          {
            path: '/investment/accounts',
            component: './investment/accounts.js',
          },
          {
            path: '/investment/capital',
            component: './investment/capital.js',
          },
          {
            path: '/investment/ipoSubscriptions',
            component: './investment/ipoSubscriptions.js',
          },
        ],
      },
      {
        path: '/search',
        name: 'search',
        component: './search/Search',
        routes: [
          {
            path: '/search/all',
            component: './search/All.js',
          },
          {
            path: '/search/articles',
            component: './search/Articles.js',
          },
          {
            path: '/search/users',
            component: './search/Users.js',
          },
        ],
      },
      {
        path: '/tags',
        name: 'tags',
        component: './tags/Tag',
        routes: [
          {
            path: '/tags/all',
            component: './tags/All.js',
          },
          {
            path: '/tags/subscribed',
            component: './tags/Subscribed.js',
          },
        ],
      },
      {
        path: '/follows',
        name: 'follows',
        routes: [
          // exception
          {
            path: '/follows/articles',
            component: './articles/follows.js',
          },
        ],
      },
      {
        path: '/stars',
        name: 'stars',
        routes: [
          {
            path: '/stars',
            component: './Account/Center/Stars',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
