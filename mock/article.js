const Mock = require('mockjs')

const List = []
const BusiList = []
const count = 100

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    assign_id: '@cword("1234567890", 11)',
    assign_name: '@ctitle(5,50)',
    busi_type: '@cword(4,10)',
    request_code: '@string(7, 10)',
    node_name: '@cword(3, 10)',
    'status|1': ['审批中', '创建','审批结束'],
    depterment: '@cword(3, 10)',
    create_time: '@datetime',
    arrive_date: '@datetime',
    timestamp: +Mock.Random.date('T'),
    creator: '@cname()',
    reviewer: '@cword()',
    
  }))
}
BusiList.push(Mock.mock({
  "busi_class|1-10": [
    {
      "value|+1": ["@cname"],
      "label|+1": ["@cname()"],
    "children|0-3": [
      {
        "value|+1": ["@cname"],
        "label|+1": ["@cname()"]
      }
    ]
  }]
}))

module.exports = [
  {
    url: '/vue-admin-template/article/list',
    type: 'get',
    response: config => {
      
      const { assign_name, status, busi_class, assign_id, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (status && item.status !== status) return false
        if (busi_class && item.busi_class !== busi_class) return false
        if (assign_id && item.assign_id !== assign_id) return false
        if (assign_name && item.assign_name.indexOf(assign_name) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-admin-template/article/busilist',
    type: 'get',
    response: config => {
          return {
            code: 20000,
            data: BusiList
          }
        }
  },

  {
    url: '/vue-admin-template/article/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const article of List) {
        if (article.id === +id) {
          return {
            code: 20000,
            data: article
          }
        }
      }
    }
  },

  {
    url: '/vue-admin-template/article/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-admin-template/article/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-admin-template/article/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

