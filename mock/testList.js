const Mock = require('mockjs')

const data = Mock.mock({
    'items|15': [{
      ASSIGN_ID: '@id',
      ASSIGN_NAME: '@ctitle(3, 65)',
      ASSIGN_TYPE: '@cword(3, 5)',
      ASSIGN_STATUS: ['审批中', '创建', '审批完毕'],
      DEPARTMENT: '@cword(5, 15)',
      CREATOR: '@cname',
      END_TIME: '@datetime',
      CITY_NAME: '@first'
    }]
  })

  module.exports = [
    {
      url: '/vue-admin-template/market/sys/testList',
      type: 'get',
      response: config => {debugger
        console.log("/vue-admin-template/market/sys/testList============="+data);
        const items = data.items
        return {
          code: 20000,
          data: {
            total: items.length,
            items: items
          }
        }
      }
    }
  ]
  // 生成数据列表
var dataList = []
debugger
for (let i = 0; i < Math.floor(Math.random() * 20 + 1); i++) {
  dataList.push(Mock.mock({
    id: '@id',
      ASSIGN_NAME: '@ctitle(3, 35)',
      ASSIGN_TYPE: '@cword(3, 5)',
      "ASSIGN_STATUS|1": [ '审批中', '创建', '审批完毕' ],
      DEPARTMENT: '@cword(5, 15)',
      CREATOR: '@cname',
      END_TIME: '@datetime',
      CITY_NAME: '@first'
  }))
}



// 获取参数列表
// export function list () {
  exports.list = function () {debugger
  console.log("dataList===="+dataList)
  return {
    // isOpen: false,
    url: '/sys/testList',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': dataList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': dataList
      }
    }
  }
}
