import request from '@/utils/request'

export function getList(params) {
  console.log("tt getList params=="+params)
  return request({
    url: '/vue-admin-template/table/list',
    method: 'get',
    params
  })
}
