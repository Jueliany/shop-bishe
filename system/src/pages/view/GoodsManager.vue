<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="queryInfo.category" placeholder="请选择类型">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
        <el-col :span="6">
          <el-input placeholder="请输入内容" v-model="queryInfo.keyWord" class="input-with-select" clearable>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="handlAddGoods">添加商品</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="id" label=编号  width="50" ></el-table-column>
        <el-table-column prop="title" label="名称" width="300"></el-table-column>
        <el-table-column prop="category" label="类型" ></el-table-column>
        <el-table-column prop="state" label="上架状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" @change="stateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="是否精选">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.choiceness" @change="choicenessChange(scope.row)">
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
      :title="formType == 1? '新增商品' : '修改商品'"
      :visible.sync="dialogAdd"
      width="70%" 
      :close-on-click-modal="false"
      >
      <el-form class="good-form" ref="form" :model="goodForm" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="goodForm.name"></el-input>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="6">
           <el-form-item label="类型">
              <el-select v-model="goodForm.category_id" placeholder="请选择类型">
                <el-option v-for="item of categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="数量">
              <el-input v-model="goodForm.stock_number"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="原价格">
              <el-input v-model="goodForm.old_price"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="最新价格">
              <el-input v-model="goodForm.price"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="简介">
          <el-input type="textarea" v-model="goodForm.brief"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-tooltip class="item" effect="dark" content="点击上传图片" placement="top">              
            <div class="pic-item">
              <img :src="goodForm.url" alt="" @click="handleChoosePic" width="178px" height="178px" />
    　　      <input type="file" @change="handleUploadPic($event,1)"  id="pictrueUpload" style="margin-top:10px;display: none">
            </div>
          </el-tooltip>
        </el-form-item>
        
        <el-form-item label="商品详情">
          <quill-editor
              v-model="goodForm.detail"
              :options="editorOption"
              ref="QuillEditor">
          </quill-editor>
    　　   <input type="file" @change="handleUploadPic($event,2)"  id="pictrueUploadquill" style="margin-top:10px;display: none">
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
        categoryList: [{id: -1, name:'请选择商品类型'},
          {id: 2, name:'数码音响'},
          {id: 3, name:'家用电器'},
          {id: 4, name:'首饰包包'},
          {id: 5, name:'电脑器材'},
          {id: 6, name:'手机平板'},
          {id: 7, name:'时尚手表'},
          {id: 8, name:'美食酒类'},
          {id: 9, name:'化妆护肤'},],
        stateList: [{id: -1, name:'请选择商品状态'},{id: 1, name:'上架'},{id: 0, name:'下架'},],
        queryInfo: {
          pageNum: 1,
          pageSize: 10,
          type: 1,
          state: -1,
          category_id: -1,
          keyWord: ""
        },
        id: 0,
        formType: 1,
        goodForm: {
          name: '',
          category_id: "",
          old_price: '',
          price: '',
          stock_number: '',
          sold_number:0,
          look_number: 0,
          state: 1,
          brief:'',
          detail:'',
          url: '',
          choiceness:0
        },
        fileList:[],
        total:0,
        tableData: [],
        content: '123',
        editorOption: {                
            modules: {
                toolbar: {
                    container: toolbarOptions,  // 工具栏
                    handlers: {
                        'image': function (value) {

                            if (value) {
                                // 调用iview图片上传
                                document.getElementById('pictrueUploadquill').click()
                            } else {
                                this.quill.format('image', false);
                            }
                        }
                    }
                }
            }
        }
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
        const result =  await this.$http.post( '/goods/list',this.queryInfo);
          
          let list = result.data.data.rows.map(item =>{
            return {
              id: item.id,
              title: item.name,
              category: item.category.name,
              state: item.state == 1 ? true : false,
              choiceness: item.choiceness == 1 ? true : false,
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
      handlAddGoods(){
        this.formType = 1;
        this.goodForm =   JSON.parse(resetData)
        this.dialogAdd = true;
      },
      //保存商品信息
      async saveGoods(){
        let apiUrl = "";
        let postData = {};
        if(this.formType){
          apiUrl = '/goods/add'
          postData = this.goodForm
        }else{
          postData = {id:this.id, data: this.goodForm}
          apiUrl = '/goods/update';
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
      //查询商品信息回显修改
      async handleFindGood(item){
        this.id = item.id
        const result =  await this.$http.post( '/goods/find',{id: item.id});
        this.formType = 0;
        this.goodForm = result.data.data
        this.dialogAdd = true
      },
      //删除商品
      async handleDeleteGood(item){
        const result =  await this.$http.post( '/goods/delete',{id: item.id});
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
        const result =  await this.$http.post( '/goods/update',postData);
        if(result.data.resultCode == 0){
          this.$message.success('修改成功')
          this.loadList()
        }else{
          this.$message.error('修改失败')
          info.state = !info.state
        }
      },
      //修改优选推荐
       async choicenessChange (info){
        console.log(info);
        const choiceness = info.choiceness ? 1 : 0
        const postData = {id:info.id, data: {choiceness }}
        const result =  await this.$http.post( '/goods/update',postData);
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
              this.goodForm.url = result.data.url
            }else{
              this.handleSuccess(result.data.url)
            }
            
          }     
        }     
      },
      handleSuccess (res) {
        // 获取富文本组件实例
        let quill = this.$refs.QuillEditor.quill
        // 如果上传成功
        if (res) {
            // 获取光标所在位置
            let length = quill.getSelection().index;
            // 插入图片，res为服务器返回的图片链接地址
            quill.insertEmbed(length, 'image', res)
            // 调整光标到最后
            quill.setSelection(length + 1)
        } else {
            // 提示信息，需引入Message
            Message.error('图片插入失败')
        }
      },
    }
  }
  let resetData = JSON.stringify({
          name: '',
          category_id: "",
          old_price: '',
          price: '',
          stock_number: '',
          sold_number:0,
          look_number: 0,
          state: 1,
          brief:'',
          detail:'',
          choiceness:0,
          url: 'https://dss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=873030975,658600237&fm=26&gp=0.jpg'
        })
   const toolbarOptions =[
              ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
              [{ 'header': 1 }, { 'header': 2 }],        //标题，键值对的形式；1、2表示字体大小
              [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
              [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
              [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
              [{ 'align': [] }],    //对齐方式
              ['clean'],    //清除字体样式
              ['image','video']    //上传图片、上传视频
            ]
</script>
<style lang="less">
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
.good-form{
  height:550px;
  overflow-y: scroll;
  overflow-x: hidden;
}
.ql-editor{
        height:360px !important;
    }
</style>