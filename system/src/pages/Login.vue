<template>
	<div class="login-container login-bg">
		<div class="login-box">
      <div class="logo">商城后台</div>
			<el-form ref="LoginFormRef" :model="form" :rules="loginRules"  label-width="0px">
			  <el-form-item label="" prop="username">
			    <el-input v-model="form.username"  placeholder="请输入用户名"  prefix-icon="el-icon-user-solid" ></el-input>
			  </el-form-item>
			  <el-form-item label="" prop="password">
			    <el-input v-model="form.password"  placeholder="请输入密码" type="password" prefix-icon="el-icon-lock"></el-input>
			  </el-form-item>
			  <div class="login-button">
				  <el-button @click="login" type="primary">登陆</el-button>
				  <el-button @click="resetLoginForm" type="info">重置</el-button>
				</div>
			</el-form>		
		</div>
	</div>
</template>
<script>
	export default {
		data() {
      return {
        form: {
          username: '',
          password: '',
        },
        loginRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
             { min: 3, message: '长度最少4位字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'change' }
          ],
        }
      }
    },
    methods:{
    	 login() {
    		this.$refs.LoginFormRef.validate(async valid=>{
    			if(valid){
    				const result =	await this.$http.post( '/token',{
    					account:this.form.username,
    					type:200,
    					secret:this.form.password,
    				});
    				console.log(result)
    				if(result.data.resultCode == 0){
    					localStorage.setItem('token',result.data.token)
    					this.$message.success('登陆成功！')
              this.$router.push('/home')
    				}else{
    					this.$message.error(result.data.msg)
    				}
    			}
    		})
    	},
    	resetLoginForm() {
    		// console.log(this.$refs)
    		this.$refs.LoginFormRef.resetFields()
    	}
    }
	}
</script>
<style lang="less" scoped>
.login-container {
	height: 100%;
	background-color: #2b4b6b;
}
.login-box {
	height: 300px;
	width: 450px;
	background-color: transparent;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 80px 20px;
	box-sizing: border-box;
    box-shadow: 0px 0px 10px #aaa;
  .logo{
    height: 80px;
    width: 300px;
    background-color: transparent;
    line-height: 80px;
    text-align: center;
    box-shadow: 0px 0px 10px #aaa;
    font-size: 38px;
    color: #f8f8f8;
    position: absolute;
    left: 50%;
    top: -100px;
    transform: translate(-50%, -0%);
    z-index: 1000;
  }
}
.login-button{
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
}
.login-bg {
    /* background: #eeeeee 0 0 no-repeat; */
    background: url(../assets/bg.png) no-repeat center;
    background-size: cover;
    overflow: hidden;
}
</style>