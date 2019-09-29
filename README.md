English | [简体中文](./README.zh-CN.md) 
<h1 align="center">Ant Community</h1>
<p style="text-indent:2em;font-size:16px">
    Ant Community 是一个为个人、企业用户构建用户社区服务的应用开发平台，为用户提供文章的编辑、发布、审核、收藏、点赞、评论、分享，用户注册、认证、关注、全文检索、智能推荐等功能。提供Web浏览器、android、iOS多端应用；
    前端基于React、Ant design pro技术，后端服务基于springboot2.1.7、shiro、jpa、ealsticsearch、jwt等技术；数据存储使用msyql数据库、elasticsearch索引数据。
</p>
1、首页-显示文章列表，本周热议
<img src="https://github.com/naruto-kyubi/ant-design-pro/blob/master/img/ant-home.jpg"></img>
2、文章详情，文章搜藏、点赞、评论、分享、相关推荐等
<img src="https://github.com/naruto-kyubi/ant-design-pro/blob/master/img/ant-detail.jpg"></img>
3、个人中心，文章、收藏、关注、粉丝等。
<img src="https://github.com/naruto-kyubi/ant-design-pro/blob/master/img/ant-personal.jpg"></img>
<!-- <div align="center">
</div> -->

Ant Community 社区由多个开源项目组成，通过编译、构建、配置，才能够正常运行，组成项目如下：
- 网页前端：https://github.com/naruto-kyubi/ant-design-pro
- 后端服务：https://github.com/naruto-kyubi/ant-community
- android端：待补充
- iOS端：待补充

<p>怎么构建、配置工程，参见各自开源项目的说明文档。</p>

- Preview: http://221917tf79.imwork.net/
- Home Page: http://221917tf79.imwork.net/
- Documentation: http://pro.ant.design/docs/getting-started
- ChangeLog: http://pro.ant.design/docs/changelog
- FAQ: http://pro.ant.design/docs/faq
- Mirror Site in China: http://ant-design-pro.gitee.io

## 0.9 Released Now! 🎉🎉🎉
[Announcing Ant Community Pro 0.9.0]

## Translation Recruitment :loudspeaker:

We need your help: https://github.com/ant-design/ant-design-pro/issues/120

## Features

- :gem: **Neat Design**: Follow [Ant Design specification](http://ant.design/)
- :triangular_ruler: **Common Templates**: Typical templates for enterprise applications
- :rocket: **State of The Art Development**: Newest development stack of React/umi/dva/antd
- :iphone: **Responsive**: Designed for variable screen sizes
- :art: **Theming**: Customizable theme with simple config
- :globe_with_meridians: **International**: Built-in i18n solution
- :gear: **Best Practices**: Solid workflow to make your code healthy
- :1234: **Mock development**: Easy to use mock development solution
- :white_check_mark: **UI Test**: Fly safely with unit and e2e tests

## Templates

```
- Dashboard
  - Analytic
  - Monitor
  - Workspace
- Form
  - Basic Form
  - Step Form
  - Advanced From
- List
  - Standard Table
  - Standard List
  - Card List
  - Search List (Project/Applications/Article)
- Profile
  - Simple Profile
  - Advanced Profile
- Account
  - Account Center
  - Account Settings
- Result
  - Success
  - Failed
- Exception
  - 403
  - 404
  - 500
- User
  - Login
  - Register
  - Register Result
```

## Usage

### server
项目包含服务端和前端（当前工程），为了项目能正常运行，首先要clone https://github.com/naruto-kyubi/ant-community.git 工程，配置并运行该工程，详情可参见工程说明。


### Use bash

```bash
$ git clone https://github.com/naruto-kyubi/ant-design-pro.git --depth=1
$ cd ant-design-pro
$ npm install
$ npm start         # visit http://localhost:8000
```

### Use by docker

```bash
# preview
$ docker pull antdesign/ant-design-pro
$ docker run -p 80:80 antdesign/ant-design-pro
# open http://localhost

# dev
$ npm run docker:dev

# build
$ npm run docker:build


# production dev
$ npm run docker-prod:dev

# production build
$ npm run docker-prod:build
```

### Use Gitpod

Open the project in Gitpod (free online dev environment for GitHub) and start coding immediately.

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/ant-design/ant-design-pro)

More instructions at [documentation](http://pro.ant.design/docs/getting-started).

## Browsers support

Modern browsers and IE11.

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/opera/opera_48x48.png" alt="Opera" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)</br>Opera |
| --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions

## Contributing

Any type of contribution is welcome, here are some examples of how you may contribute to this project:

- Use Ant Design Pro in your daily work.
- Submit [issues](http://github.com/ant-design/ant-design-pro/issues) to report bugs or ask questions.
- Propose [pull requests](http://github.com/ant-design/ant-design-pro/pulls) to improve our code.
