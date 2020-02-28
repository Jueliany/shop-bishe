<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>小程序管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页图片</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入商品ID" v-model="queryInfo.goods_id" class="input-with-select" clearable>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryInfo.state" placeholder="请选择状态">
            <el-option
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-input placeholder="请输入图片标题内容" v-model="queryInfo.keyWord" class="input-with-select" clearable>
            <el-button slot="append" @click="search" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handlAddGoods">添加图片</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="id" label=编号  width="50" ></el-table-column>
        <el-table-column prop="title" label="名称" width="300"></el-table-column>
        <el-table-column prop="goods_id" label="绑定商品ID" ></el-table-column>
        <el-table-column prop="goods_name" label="绑定商品名称" ></el-table-column>
        <el-table-column prop="state" label="显示状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="stateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改商品" placement="top">
              <el-button type="primary" size="small"  @click="handleFindGood(scope.row)" icon="el-icon-edit"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除商品" placement="top">
              <el-button type="primary" size="small"  @click="handleDeleteGood(scope.row)" icon="el-icon-delete"></el-button>
            </el-tooltip>
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
      :title="formType == 1? '新增图片' : '修改图片'"
      :visible.sync="dialogAdd"
      width="50%" 
      :close-on-click-modal="false"
      >
      <el-form ref="form" :model="bannerForm" label-width="80px">
        <el-form-item label="图片名称">
          <el-input v-model="bannerForm.name"></el-input>
        </el-form-item>
        <el-form-item label="绑定商品">
          <el-select v-model="bannerForm.goods_id" filterable  placeholder="请选择绑定商品">
            <el-option v-for="item of goodsList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片">
          <div class="pic-item">
            <img  :src="bannerForm.pic_url" alt="图片错误" @click="handleChoosePic" width="328px" height="175px" />
    　　     <input type="file" @change="handleUploadPic($event,1)"  id="pictrueUpload" style="margin-top:10px;display: none">
          </div>
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
        stateList: [{id: -1, name:'请选择图片状态'},{id: 1, name:'显示'},{id: 0, name:'不显示'},],
        queryInfo: {
          pageNum: 1,
          pageSize: 10,
          state: -1,
          goods_id: "",
          keyWord: ""
        },
        id: 0,
        formType: 1,
        bannerForm: {
          name: '',
          pic_url: "",
          goods_id: 1,
          state: 0,
        },
        goodsList:[],
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
        const result =  await this.$http.post( '/banner/list',this.queryInfo);
          let list = result.data.data.rows.map(item =>{
            return {
              id: item.id,
              title: item.name,
              goods_name: item.good.name,
              state: item.state == 1 ? true : false,
              goods_id: item.goods_id,
            }
          }) 
          this.total = result.data.data.count;
          this.tableData = list;
          console.log(list)
      },
      //搜索
      search(){
        this.loadList()
      },
      //新增商品
      async handlAddGoods(){
        const goodResult =  await this.$http.get( '/goods/select');
        this.goodsList = goodResult.data.data
        this.formType = 1;
        this.bannerForm =   JSON.parse(resetData)
        this.dialogAdd = true;
      },
      //保存商品信息
      async saveGoods(){
        let apiUrl = "";
        let postData = {};
        if(this.formType){
          apiUrl = '/banner/add'
          postData = this.bannerForm
        }else{
          postData = {id:this.id, data: this.bannerForm}
          apiUrl = '/banner/update';
        }
        const result =  await this.$http.post( apiUrl ,postData);
        if(result.data.resultCode == 0){
          this.$message.success('保存成功')
          this.dialogAdd = false;
          this.loadList()
        }else{
          this.$message.error('保存失败')
        }
          
      },
      //查询图片信息回显修改
      async handleFindGood(item){
        const goodResult =  await this.$http.get( '/goods/select');
        this.goodsList = goodResult.data.data
        this.id = item.id
        const result =  await this.$http.post( '/banner/find',{id: item.id});
        this.formType = 0;
        this.bannerForm = result.data.data
        this.dialogAdd = true
      },
      //删除商品
      async handleDeleteGood(item){
        const result =  await this.$http.post( '/banner/delete',{id: item.id});
        if(result.data.resultCode == 0){
          this.$message.success('删除成功')
          this.loadList()
        }else{
          this.$message.error('删除失败')
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
      //修改状态
      async stateChange (info){
        console.log(info);
        const state = info.state ? 1 : 0
        const postData = {id:info.id, data: {state }}
        const result =  await this.$http.post( '/banner/update',postData);
        if(result.data.resultCode == 0){
          this.$message.success('修改成功')
          this.loadList()
        }else{
          this.$message.error('修改失败')
          info.state = !info.state
        }
      },
      //点击选择图片
      handleChoosePic(){
        document.getElementById('pictrueUpload').click()      
      },
      //上传图片
      async handleUploadPic(e,type){

        if(window.FileReader) {
          var file  = e.target.files[0];
          var reader = new FileReader();
          if (file && file.type.match('image.*')) {
              reader.readAsDataURL(file);
          } else {
              this.$message.error('选择图片格式错误')
          }
          reader.onloadend = async e => {
            let postData = {base64: reader.result};
            const result =  await this.$http.post( '/img/upload',postData);
            if(type == 1){
              this.bannerForm.pic_url = result.data.url
            }else{
            }
            
          }     
        }     
      },
    }
  }
  let resetData = JSON.stringify( {
          name: '',
          pic_url: "http://120.27.237.29:5200/img/pic1579349131926.jpeg",
          goods_id: "",
          state: 0,
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