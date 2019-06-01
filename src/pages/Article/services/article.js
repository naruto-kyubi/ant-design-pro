/* eslint-disable import/prefer-default-export */
import request from '@/utils/request';

export async function queryArticles() {
  // return request(`/api/fake_list?${stringify(params)}`);

  // 获取服务端的文章列表
  return request(`/naruto/v1/article/query`);
}
