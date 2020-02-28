<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card search-box">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input placeholder="请输入订单编号" v-model="queryInfo.order_number" class="input-with-select" clearable>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入商品ID" v-model="queryInfo.goods_id" class="input-with-select" clearable>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input placeholder="请输入用户ID" v-model="queryInfo.user_id" class="input-with-select" clearable>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryInfo.product_type" placeholder="请选择商品类型">
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="queryInfo.order_state" placeholder="请选择订单状态">
            <el-option
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="queryInfo.aftersale_state" placeholder="请选择售后状态">
            <el-option
              v-for="item in aftersaleList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="9">
          <el-date-picker
            v-model="queryInfo.datetime"
            type="datetimerange"
            align="right"
            start-placeholder="下单开始日期"
            end-placeholder="下单结束日期"
            :default-time="['00:00:00', '23:59:59']">
          </el-date-picker>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="search">搜索</el-button>
        </el-col>
      </el-row>
      <el-table
        v-loading="loading"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column prop="order_number" label="订单编号"  width="200" ></el-table-column>
        <el-table-column prop="goods_id" label="商品ID" width="80"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="160"></el-table-column>
        <el-table-column prop="order_price" label="金额" width="80"></el-table-column>
        <el-table-column prop="goods_number" label="数量" width="50"></el-table-column>
        <el-table-column prop="stateStr" label="订单状态" width="80"></el-table-column>
        <el-table-column  label="顾客信息" width="280">
          <template slot-scope="scope">
            <p>{{scope.row.manname}}  {{scope.row.phone}}</p>
            <p>{{scope.row.address}}</p>
            <p>备注：{{scope.row.order_remark}} </p>
            <!-- <span v-else-if="scope.row.order_state >= 2 && scope.row.express_number != ''">
              {{scope.row.express_number}}
            </span> -->
          </template>
        </el-table-column>
        <el-table-column  label="操作"  width="180">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="订单详情" placement="top">
              <el-button type="primary" size="mini"  @click="handleOrderDetail(scope.row.id)" icon="el-icon-s-order"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.order_state == 1" class="item" effect="dark" content="发货" placement="top">
              <el-button type="success" size="mini"  @click="handleSendOrder(scope.row.id)" icon="el-icon-truck"></el-button>
            </el-tooltip>
            <el-tooltip v-if="scope.row.aftersale_state==1" class="item" effect="dark" content="售后" placement="top">
              <el-button type="danger" size="mini"  @click="handleAftersale(scope.row.id)" icon="el-icon-s-comment"></el-button>
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
    <!-- 售后 -->
    <el-dialog
      title="售后"
      :visible.sync="aftersaleVisible"
      width="30%">
      <el-form ref="form" :model="aftersaleForm">
        <el-row :gutter="20">
          <!-- <el-col :span="12">
           <el-form-item label="售后原因">
              <el-input v-model="aftersaleForm.aftersale_bcs"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="20">
            <el-form-item label="金额">
              <el-input v-model="aftersaleForm.aftersale_price"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="退款理由" width="15%">
          <el-input type="textarea" v-model="aftersaleForm.aftersale_remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="aftersale(2)">确 定</el-button>
        <el-button type="primary" @click="aftersale(3)">驳 回</el-button>
        <el-button @click="aftersaleVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 发货 -->
    <el-dialog
      title="订单发货"
      :visible.sync="expressVisible"
      width="30%">
      <el-input type="input" placeholder="请输入快递单号" v-model="expressNumber"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendOrder()">确 定</el-button>
        <el-button @click="expressVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 订单详情 -->
    <el-dialog
      title="订单详情"
      :visible.sync="detailVisible"
      width="900px">
      <div class="item-name">订单信息</div>
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          订单编号：{{orderDetail.order_number}}
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          订单状态：{{orderStateStr[orderDetail.order_state]}}
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
         <el-col :span="8"><div class="grid-content bg-purple">
          下单时间: {{moment(orderDetail.created_at).format('YYYY-MM-DD HH:mm:ss')}}
        </div></el-col>
        <el-col :span="8" v-if="orderDetail.pay_datetime"><div class="grid-content bg-purple">
          支付时间: {{moment(orderDetail.pay_datetime).format('YYYY-MM-DD HH:mm:ss')}}
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
         <el-col :span="8"  v-if="orderDetail.send_datetime"><div class="grid-content bg-purple">
          发货时间: {{moment(orderDetail.send_datetime).format('YYYY-MM-DD HH:mm:ss')}}
        </div></el-col>
        <el-col :span="8"   v-if="orderDetail.get_datetime"><div class="grid-content bg-purple">
          成交时间: {{moment(orderDetail.get_datetime).format('YYYY-MM-DD HH:mm:ss')}}
        </div></el-col>
      </el-row>
      <div class="item-name">商品信息</div>
      <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          商品ID：{{orderDetail.goods_id}}
        </div></el-col>
        <el-col :span="15"><div class="grid-content bg-purple" style="display: flex;">
          <span style="width: 99px">商品名称:</span><span>{{orderDetail.goods.name}}</span> 
        </div></el-col>
      </el-row>
       <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          商品单价：￥{{orderDetail.order_price}}
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          商品数量： ×{{orderDetail.goods_number}}
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          商品总额：￥{{orderDetail.order_price * orderDetail.goods_number}}
        </div></el-col>
      </el-row>
      <div class="item-name">用户信息</div>
       <el-row :gutter="20">
        <el-col :span="8"><div class="grid-content bg-purple">
          收货人：{{orderDetail.manname}}
        </div></el-col>
        <el-col :span="8"><div class="grid-content bg-purple">
          收货号码: {{orderDetail.phone}}
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content bg-purple">
          收货地址：{{orderDetail.address}}
        </div></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24"><div class="grid-content bg-purple">
          订单备注：{{orderDetail.order_remark}}
        </div></el-col>
      </el-row>
      
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="sendOrder()">确 定</el-button> -->
        <el-button @click="detailVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  export default {
    data (){
      return {
        input: '',
        orderDetail:{goods:{name:''}},
        detailVisible:false,
        expressVisible:false,
        detailVisible:false,
        aftersaleVisible: false,
         categoryList: [{id: -1, name:'请选择商品类型'},
          {id: 2, name:'数码音响'},
          {id: 3, name:'家用电器'},
          {id: 4, name:'首饰包包'},
          {id: 5, name:'电脑器材'},
          {id: 6, name:'手机平板'},
          {id: 7, name:'时尚手表'},
          {id: 8, name:'美食酒类'},
          {id: 9, name:'化妆护肤'},],
        stateList: [
          {id: -1, name:'请选择订单状态'},
          {id: 0, name:'未付款'},
          {id: 1, name:'待发货'},
          {id: 2, name:'已发货'},
          {id: 3, name:'已完成'},
          {id: 4, name:'已关闭'}],
        aftersaleList: [{id: -1, name:'请选择售后状态'},
        {id: 0, name:'无售后'},
        {id: 1, name:'售后中'},
        {id: 2, name:'售后完成'},
        {id: 3, name:'售后驳回'},
        {id: 5, name:'售后取消'}],
        orderStateStr : ['未付款','待发货','已发货','已完成','已关闭'],
        queryInfo: {
          pageNum: 1,
          pageSize: 10,
          datetime:'',
          order_number: "",
          user_id: "",
          goods_id: "",
          aftersale_state: -1,
          order_state: -1,
          category_id: -1,
        },
        aftersaleForm:{
          aftersale_remark:"",
          aftersale_price:"",
          aftersale_bcs:"",
        },
        id: 0,
        expressNumber:"",
        loading:false,
        formType: 1,
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
        this.loading = true;
        const result =  await this.$http.post( '/order/list',this.queryInfo);
          let list = result.data.data.rows.map(item =>{
            return {
              id : item.id,
              aftersale_state : item.aftersale_state,
              order_state : item.order_state,
              order_number : item.order_number,
              order_price : item.order_price,
              category_id : item.category_id,
              created_at : this.moment(item.created_at).format('YYYY-MM-DD HH:mm:ss'),
              goods_number : item.goods_number,
              express_number : item.express_number,
              goods_name: item.goods.name,
              goods_id: item.goods.id,
              manname:item.manname,
              phone:item.phone,
              address:item.address,
              order_remark:item.order_remark,
              category: categoryList[item.goods.category_id],
              stateStr: orderStateStr[item.order_state],
            }
          }) 
          this.total = result.data.data.count;
          this.tableData = list;
          this.loading = false;
      },
      //搜索
      search(){
        this.loadList()
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
      //售后详情
      async handleAftersale(id){
        this.id = id
        const result =  await this.$http.post( '/order/find',{id});
         if(result.data.resultCode == 0){

          this.aftersaleForm = {
            aftersale_remark:result.data.data.aftersale_remark,
            aftersale_price:result.data.data.aftersale_price,
            aftersale_bcs:result.data.data.aftersale_bcs,
            aftersale_express:result.data.data.aftersale_express,
          }
          this.aftersaleVisible = true;
        }else{
          this.$message.error('失败')
        }
        
      },
      //售后处理
      async aftersale(type){
        let postData = {id: this.id, data:{aftersale_state: type}}
        const result =  await this.$http.post( '/order/update',postData);
        if(result.data.resultCode == 0){
          this.$message.success('成功')
          this.aftersaleVisible = false;
          this.loadList()
        }else{
          this.$message.error('失败')
        }
      },
      handleSendOrder(id){
        this.id = id;
        this.expressNumber = "";
        this.expressVisible = true;
      },
      //发货
      async sendOrder(){
        let now = Date.now();
        let postData = {id: this.id, data:{express_number: this.expressNumber,order_state: 2,send_datetime:now}}
        const result =  await this.$http.post( '/order/update',postData);
        if(result.data.resultCode == 0){
          this.$message.success('发货成功')
          this.expressVisible = false;
          this.loadList()
        }else{
          this.$message.error('失败')
        }
      },
      //查看订单详情
      async handleOrderDetail(id){
        this.id = id
        const result =  await this.$http.post( '/order/find',{id});
         if(result.data.resultCode == 0){
          this.orderDetail = result.data.data
          this.detailVisible = true;
        }else{
          this.$message.error('失败')
        }
      },
    }
  }
  var categoryList = ['', '','数码音响','家用电器','首饰包包','电脑器材','手机平板','时尚手表','美食酒类','化妆护肤']
  var orderStateStr = ['未付款','待发货','已发货','已完成','已关闭']
</script>
<style lang="less" scoped>
.el-table{
  margin-top: 15px;
}
.el-row{
  margin-bottom: 10px;
}
.search-box{

  .el-input{
    width: 222px !important;
  }
}
.item-name{
    background: #f7f7f7;
    border: 1px solid #e2e2e2;
    padding-left: 5px;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
    margin-top: 30rpx;
}
.el-row{
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>