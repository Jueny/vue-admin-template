<template>
  <div class="app-container">
    <div class="filter-container">
      工单名称
      <el-input v-model="listQuery.assign_name" placeholder="工单名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      审批状态
      <el-select v-model="listQuery.status" clearable placeholder="审批状态"  style="width: 110px" class="filter-item">
        <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <!-- 业务大类
      <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      业务子类
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <span class="demonstration">业务类型</span>
      <el-cascader v-model="listQuery.busi_class" clearable :options="busi_class" :show-all-levels="false" @change="handleChange" @click="getBusiList"></el-cascader>
      申请单编号
      <el-input v-model="listQuery.assign_id" placeholder="ASSIGN_ID" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      
      <el-button  type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button  class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="工单名称" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.assign_name }}</span>
          
        </template>
      </el-table-column>
      <el-table-column label="业务类型" width="135px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.busi_type }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="申请单编号" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.assign_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="节点名称" width="135px">
        <template slot-scope="{row}">
            <span>{{ row.node_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="工单状态" align="center" width="95">
        <template slot-scope="{row}">
          <el-tag :type="row.status | statusFilter">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="申请人" class-name="status-col" width="100">
       <template slot-scope="{row}">
           <span>{{ row.creator }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请日期" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.create_time  }}</span>
        </template>
      </el-table-column>
      <el-table-column label="到达时间" width="100px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arrive_date }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
           <span>{{ row.depterment }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="showReviewer" label="Reviewer" width="110px" align="center">
        <template slot-scope="{row}">
          <span style="color:red;">{{ row.reviewer }}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <!-- <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item label="申请日期" prop="create_time">
          <el-date-picker v-model="temp.create_time" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="到达时间" prop="arrive_date">
          <el-date-picker v-model="temp.arrive_date" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="工单名称" prop="assign_name">
          <el-input v-model="temp.assign_name" />
        </el-form-item>
        <el-form-item label="工单状态">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          Cancel
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          Confirm
        </el-button>
      </div>
    </el-dialog> -->

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
</div>
</template>

<script>
import { fetchList,fetchBusiList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  // directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        审批中: 'success',
        创建: 'info',
        审批结束: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        // importance: undefined,
        // title: undefined,
        // type: undefined,
        assign_name: undefined,
        status: undefined,
        busi_class: undefined,
        assign_id: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['','审批中', '创建', '审批结束'],
      // showReviewer: false,
      // temp: {
      //   id: undefined,
      //   importance: 1,
      //   remark: '',
      //   create_time: new Date(),
      //   arrive_date: new Date(),
      //   assign_name: '',
      //   type: '',
      //   status: 'published'
      // },
      dialogFormVisible: false,
      // dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,

value: [],
busi_class : [],
  //       busi_class: [{
	//   value: 'zhinan',
	//   label: '指南',
	//   children: [{
	//   }]
	//   },{
	//   value: 'ziyuan',
	//   label: '业务资源',
	//   children: [{
	// 	value: 'axure',
	// 	label: 'Axure Components'
	//   }, {
	// 	value: 'sketch',
	// 	label: 'Sketch Templates'
	//   }, {
	// 	value: 'jiaohu',
	// 	label: '组件交互文档'
	//   }]},{
	//   value: 'ziyuan',
	//   label: '营销管理',
	//   children: [{
	// 	value: '12',
	// 	label: '虚拟网资费管理'
	//   },{
	//   value: 'ziyuan',
	//   label: '资源',
	//   children: [{
	// 	value: 'axure',
	// 	label: 'Axure Components'
	//   }, {
	// 	value: 'sketch',
	// 	label: 'Sketch Templates'
	//   }, {
	// 	value: 'jiaohu',
	// 	label: '组件交互文档'
	//   }]
	// }]
	// }]
      };
    
  },
  created() {
    this.getList()
    this.getBusiList()
  },
  methods: {
    
      handleChange(value) {
        console.log(value);
      },
      getBusiList() {
        console.log("getBusiList===");debugger
        fetchBusiList().then(response => {
        this.busi_class = response.data[0].busi_class

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })

      },


    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    // resetTemp() {
    //   this.temp = {
    //     id: undefined,
    //     importance: 1,
    //     remark: '',
    //     create_time: new Date(),
    //     arrive_date: new Date(),
    //     assign_name: '',
    //     status: 'published',
    //     type: ''
    //   }
    // },
    handleCreate() {
      // this.resetTemp()
      // this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // createData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
    //       this.temp.creator = 'vue-admin-template'
    //       createArticle(this.temp).then(() => {
    //         this.list.unshift(this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Created Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    handleUpdate(row) {
      console.log("点击工单名称")
      // this.temp = Object.assign({}, row) // copy obj
      // this.temp.create_time = new Date(this.temp.create_time)
      // this.temp.arrive_date = new Date(this.temp.arrive_date)
      // // this.dialogStatus = 'update'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })
    },
    // updateData() {
    //   this.$refs['dataForm'].validate((valid) => {
    //     if (valid) {
    //       const tempData = Object.assign({}, this.temp)
    //       tempData.create_time = +new Date(tempData.create_time)
    //       tempData.arrive_date = +new Date(tempData.arrive_date) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
    //       updateArticle(tempData).then(() => {
    //         const index = this.list.findIndex(v => v.id === this.temp.id)
    //         this.list.splice(index, 1, this.temp)
    //         this.dialogFormVisible = false
    //         this.$notify({
    //           title: 'Success',
    //           message: 'Update Successfully',
    //           type: 'success',
    //           duration: 2000
    //         })
    //       })
    //     }
    //   })
    // },
    handleDelete(row, index) {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['工单名称', '业务类型', '申请单编号', '节点名称', '工单状态','申请人','部门','申请日期','到达时间']
        const filterVal = ['assign_name', 'busi_type', 'assign_id', 'node_name', 'status','creator','depterment','create_time','arrive_date']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        // if (j === 'timestamp') {
        //   return parseTime(v[j])
        // } else {
          return v[j]
        // }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>
