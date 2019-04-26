<template>
    <div>
        <com-crumb nm = "角色"/>
        <!--分配权限对话框-->
        <el-dialog title="分配权限" :visible.sync="roleFormVisible" width="50%">
            <el-form :model="distributeForm">
                <el-form-item label="角色名称">
                    {{distributeForm.roleName}}
                </el-form-item>
                 <el-form-item label="选取权限">
                </el-form-item>
            </el-form> 
            <div slot="footer" class="dialog-footer">
                <el-button @click="roleFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="roleFormVisible = false">确 定</el-button>
            </div> 
        </el-dialog>
        <!--卡片区-->
        <el-card class="box-card">
            <!--表格-->
            <el-table :data="roleList" style = "width:100%" border stripe>
                <el-table-column type="expand">
                    <template slot-scope="info">
                        <el-row
                        v-for="(v,k) in info.row.son"
                        :key="v.id"
                        :style="{'border-bottom':'1px solid rgb(235, 238, 245)','border-top':k===0?'1px solid rgb(235, 238, 245)':''}"
                        >
                        <el-col :span="5">
                            <el-tag closable @close="delRights(info.row,v.id)">{{v.authName}}</el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <el-col :span="19">
                            <!--第二级别权限遍历-->
                            <!-- 给el-row设置变量，只有非第一个项目才有top头部边框 -->
                            <el-row
                            v-for="(vv,kk) in v.children"
                            :key="vv.id"
                            :style="{'border-top':kk!==0?'1px solid rgb(235, 238, 245)':''}"
                            >
                            <el-col :span="6">
                                <el-tag
                                type="success"
                                closable
                                @close="delRights(info.row,vv.id)"
                                >{{vv.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <el-col :span="18">
                                <!--第三级别权限遍历-->
                                <el-tag
                                type="warning"
                                v-for="vvv in vv.children"
                                :key="vvv.id"
                                closable
                                @close="delRights(info.row,vvv.id)"
                                >{{vvv.authName}}</el-tag>
                            </el-col>
                            </el-row>
                        </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column type="index" label="序号" width="240"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述" width="240"></el-table-column>
                <el-table-column label="操作" width="240">
                    <template slot-scope="info">
                        <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                            <el-button
                            type="warning"
                            icon="el-icon-setting"
                            size="mini"
                            @click="showDistributeDialog(info.row)"
                            >分配权限</el-button>
                        </el-tooltip>
                     </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    created(){
        this.getRoleList()
    },
    methods:{
        //分配权限按钮事件
        showDistributeDialog(row) {
           this.roleFormVisible = true
           this.distributeForm = row
        },
        //删除功能
        delRights(row,id){
              this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    //发送axios
                    const {data:dt} = await this.$http.delete(`roles/${row.id}/rights/${id}`)
                    if (dt.meta.status!==200) {
                        return this.$message.error(dt.meta.msg)
                    }
                    //刷新
                    row.son = dt.data
                }).catch(() => {});
        },
        async getRoleList() {
            //发送axios
            const {data:dt} = await this.$http.get('roles')
            console.log(dt)
            if (dt.meta.status !== 200) {
                return this.$message.error(dt.meta.msg)
            }
            //修改children为son
            dt.data.forEach(item=>{
                item.son = item.children
                delete item.children
            })
            //给实例属性赋值
            this.roleList = dt.data
        }
    },
    data(){
        return {
            roleFormVisible:false,
            roleList:[],
            distributeForm:{
                id:0,
                roleName:'',
                roleDesc:''
            }
        }
    }

}
</script>
<style lang = "less" scoped>
    .el-row {
        display:flex;
        align-items: center
    }
    .el-tag {
        margin: 10px 5px ;
    }
</style>