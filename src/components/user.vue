<template>
  <div>
    <!--面包屑导航-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--弹出添加对话框-->
    <el-dialog title="添加" :visible.sync="addUserDialog" width="60%" @close="resetForm()">
      <!--表单-->
      <el-form ref="addform" :model="addUser" label-width="80px" :rules="addFormRules">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="add()">确 定</el-button>
      </span>
    </el-dialog>
    <!--添加修改对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose()">
      <el-form :rules="editFormRules" ref="editFormRef" :model="editForm" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!--卡片功能-->
    <el-card class="box-card">
      <!--搜索框-->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            clearable
            @clear="search()"
            @keyup.enter.native="search()"
          >
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--表格-->
      <el-table :data="userlist" border style="width:100%" stripe>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="160"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="130"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="130"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="60">
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作">
          <!--通过templage标签同意接收作用于插槽接受的单用户信息-->
          <template slot-scope="info">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
              type="primary" 
              icon="el-icon-edit" 
              size="mini"
              @click="showEditDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!--分页功能-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="3"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getUserList();
  },
  methods: {
    //显示编辑信息的方法
    async showEditDialog(id){
        //显示对话框
        this.editDialogVisible = true
        //发送axios
        const{data:dt} = await this.$http.get('users/'+id)
        if (dt.meta.status!==200) {
            return this.$message.error(dt.meta.msg)
        }
        console.log(dt.data)
        this.editForm = dt.data
    },
    //编辑修改
    editUser(){
        //校验validate
        this.$refs.editFormRef.validate(async valid=>{
            if (valid) {
                //发送axios
                const {data:dt} = await this.$http.put('users/'+ this.editForm.id,this.editForm)
                console.log(dt)
                if(dt.meta.status !== 200) {
                    return this.$message.error(dt.meta.msg)
                }
                //修改成功提示框
                this.$message.success(dt.meta.msg)
                //关闭对话框
                this.editDialogVisible = false
                //刷新
                this.getUserList()
            }
            
        })
    },
    //删除方法
    delUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          //点击确定后发送axios
          const { data: dt } = await this.$http.delete("users/" + id);
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg);
          }
          //弹出删除成功提示
          this.$message.success(dt.meta.msg);
          //如果当前页数据只剩一条，删除后pagenum要减1
          if (this.userlist.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--;
          }
          //刷新
          this.getUserList();
        })
        .catch(() => {});
    },
    //重置添加表单
    resetForm() {
      this.$refs.addform.resetFields();
    },
    //重置修改表单
    editDialogClose() {
        this.$refs.editFormRef.resetFields();
    },
    //添加的方法
    add() {
      //在表单验证成功后发送axios
      this.$refs.addform.validate(async valid => {
        const { data: dt } = await this.$http.post("users", this.addUser);
        if (dt.meta.status !== 201) {
          return this.$message.error(dt.meta.msg);
        }
        //关闭对话框
        this.addUserDialog = false;
        //刷新
        this.getUserList();
        //弹出确认框
        this.$message.success(dt.meta.msg);
      });
    },
    //搜索的方法
    search() {
      this.getUserList();
    },
    //设置axios
    async getUserList() {
      //发送axios
      const { data: dt } = await this.$http.get("/users", {
        params: this.querycdt
      });
      //如果返回数据发生错误
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg);
      }
    //   console.log(dt);
      //给设置好的userliet赋值拿到的数据
      this.userlist = dt.data.users;
      //赋值总信息条数
      this.tot = dt.data.total;
    },
    //设置每页条数变化后触发的函数
    handleSizeChange(val) {
      this.querycdt.pagesize = val;
      this.getUserList();
    },
    //当前页数变化触发函数
    handleCurrentChange(val) {
      this.querycdt.pagenum = val;
      this.getUserList();
    }
  },
  data() {
    // 为校验手机号码生成一个函数
    var checkMobile = (rule, value, callback) => {
      // 手机号码规则：1开始,后接3|5|8|9|7,再后边跟9位数字
      // 正则表达式校验
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error("手机号码格式不正确"));
      }
      // 校验成功，继续执行
      callback();
    };
    return {
        //添加对话框数据对象
      addUser: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      //修改对话框数据对象
      editForm:{
          username:"",
          password:"",
          mobile:""
      },
      //添加对话框验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号码必填", trigger: "blur" },
          // 自定义校验手机号码规则
          // { validator: 校验函数, trigger: 'blur' }
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //修改对话框验证规则
      editFormRules: {
        username: [{ required: true, message: "请输入用户名称", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        mobile: [
          { required: true, message: "手机号码必填", trigger: "blur" },
          // 自定义校验手机号码规则
          // { validator: 校验函数, trigger: 'blur' }
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      //判断添加对话框
      addUserDialog: false,
      //判断修改对话框
      editDialogVisible:false,
      //总信息条数容器
      tot: 0,
      //用来装返回数据的容器
      userlist: [],
      //发送axios携带的参数
      querycdt: {
        query: "",
        pagenum: 1,
        pagesize: 3
      }
    };
  }
};
</script>
<style lang = "less" scoped>
</style>