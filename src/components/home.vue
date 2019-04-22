<template>
  <el-container>
    <el-header>
        <div class = "logo-box">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" @click = "logout()" >退出</el-button>
    </el-header>
    <el-container>
      <el-aside :style = "{width:isshow?'65px':'200px'}">
          <el-row>
            <el-col>
                <div style="width:200px;" 
                class="toggle_bar" 
                @click = "isshow = !isshow" 
                :style = "{width:isshow?'65px':'200px'}">|||</div>
                <el-menu
                background-color="#333744"
                text-color="#fff"
                active-text-color="#ffd04b"
                :unique-opened="true"	
                :collapse="isshow"
                :collapse-transition = "false"
                >
                    <el-submenu :index= String(item.id)
                     :style = "{width:isshow?'65px':'200px'}"
                     v-for = "(item,k) in menuList"
                     :key = "item.id">
                        <template slot="title">
                            <i :class="'iconfont icon-' +  iconList[k]"></i>
                            <span>{{ item.authName }}</span>
                        </template>
                            <el-menu-item 
                            v-for = "item2 in item.children"
                            :key = "item2.id"
                            :index = "item.id+'-'+item2.id">
                            <i class = "el-icon-menu"></i>
                            <span>{{item2.authName}}</span>
                            </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-col>
        </el-row>
      </el-aside>
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    //钩子函数
    created(){
        this.getMenuList()
    },
    data(){
        return {
            isshow:false,
            menuList : [],
            iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
        }
    },
    methods:{
        //发送axios
        async getMenuList () {
            const {data:dt} = await this.$http.get('/menus')
            console.log(dt)
            if (dt.meta.status!== 200) {
                return this.$message.error(dt.meta.msg)
            }
            this.menuList = dt.data
        },


        //退出功能
        logout(){
            this.$confirm('确认要退出系统么？', '退出', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            })
            .then(() => {
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            })
            .catch(() => {})
        }
    }
};
</script>
<style lang = "less" scoped>
    .el-container {
        height:100%;
        .el-header {
             display:flex;
             align-items: center;
             justify-content: space-between;
             color:#fff;
             background-color: #373d41; 
             .el-button {
                 background-color: rgb(236, 153, 0);
                 border:0;
             }
             .el-button:hover {
                 background-color: rgb(253, 175, 31);
             }
        }
        .el-aside {
            background-color: #333744;
            .toggle_bar {
                height:25px;
                color:#fff;
                text-align:center;
                line-height: 25px;
                letter-spacing: 0.1em;
                background-color:#4a5064;
                font-size:12px;
                user-select: none;
                cursor: pointer;      
            }
        }
        .el-main {
            background-color: #eaedf1;
        }
    }
</style>