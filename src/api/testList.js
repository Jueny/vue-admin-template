import request from '@/utils/request'

export function getList(params) {
    console.log("getList params=="+params)
  return request({
    url: '/vue-admin-template/market/sys/testList',
    method: 'get',
    params
  })
}
