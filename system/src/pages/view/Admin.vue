<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>小程序管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页图片</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="handlAddUser">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="id" label=编号  width="50" ></el-table-column>
        <el-table-column prop="nickname" label="用户名" width="300"></el-table-column>
        <el-table-column prop="email" label="邮箱" ></el-table-column>
        <el-table-column prop="state" label="用户状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="stateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        
      </el-table>
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 新增商品弹窗 -->
    <el-dialog
      title="新增用户"
      :visible.sync="dialogAdd"
      width="50%" 
      :close-on-click-modal="false"
      >
      <el-form ref="form" :model="userForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="userForm.password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible">取 消</el-button>
        <el-button type="primary" @click="saveGoods" >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        input: '',
        dialogAdd: false,
        id: 0,
        formType: 1,
        userForm: {
          nickname: '',
          password: "",
          email:'',
          type:1,
          state: 1,
        },
        queryInfo:{
          pageNum: 1,
          pageSize: 10,
        },
        total:0,
        tableData: [],
      }
    },
    created(){
      this.loadList ()
    },
    computer:{
    },
    methods: {
      //加载列表数据
      async loadList (){
        const result =  await this.$http.get( '/user/list');
          this.total = result.data.data.count;
              
          this.tableData = result.data.data.rows.map(item=>{
              item.state = item.state == 1 ? true : false
              return item
          });
      },
      
      //新增商品
      async handlAddUser(){
        this.formType = 1;
        this.userForm =   JSON.parse(resetData)
        this.dialogAdd = true;
      },
      //保存商品信息
      async saveGoods(){
        let apiUrl = "";
        let postData = {};
          apiUrl = '/user/add'
          postData = this.userForm
        const result =  await this.$http.post( apiUrl ,postData);
        if(result.data.resultCode == 0){
          this.$message.success('保存成功')
          this.dialogAdd = false;
          this.loadList()
        }else{
          this.$message.error('保存失败')
        }
          
      },
       //修改状态
      async stateChange (info){
        console.log(info);
        const state = info.state ? 1 : 0
        const postData = {id:info.id, data: {state }}
        const result =  await this.$http.post( '/user/update',postData);
        if(result.data.resultCode == 0){
          this.$message.success('修改成功')
          this.loadList()
        }else{
          this.$message.error('修改失败')
          info.state = !info.state
        }
      },
      //隐藏弹窗
      dialogVisible(){
        this.dialogAdd = false;
      },
      //选择每页展示数量
      handleSizeChange (val){
        this.queryInfo.pageSize = val
         console.log(`每页 ${val} 条`);
         this.loadList ()
      },
      // 跳转页面
      handleCurrentChange (val){
        this.queryInfo.pageNum = val
         this.loadList ()
      },
      
    }
  }
  let resetData = JSON.stringify( {
          nickname: '',
          password: "",
          email:'',
          type:1,
          state: 1,
        })
</script>
<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.pic-item{
  display:inline-block;
  cursor: pointer;
  img{
    border:1px solid #fff;
  }
}
.pic-item:hover{
  img{
    border:1px solid red;
  }
}
</style>