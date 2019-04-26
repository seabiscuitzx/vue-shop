<template>
    <div>
       <!--面包屑导航-->
        <com-crumb nm = "权限"/>
        <!-- 卡片区 -->
        <el-card class="box-card">
        <!--数据列表区域-->
        <el-table :data="rightsList" style="width: 100%" border stripe>
            <el-table-column type="index" label="序号" width="200"></el-table-column>
            <el-table-column prop="authName" label="权限名称" ></el-table-column>
            <el-table-column prop="path" label="路径" width="200"></el-table-column>
            <el-table-column prop="level" label="等级" width="200">
            <template slot-scope="info">
                <el-tag v-if="info.row.level==0">一级</el-tag>
                <el-tag v-else-if="info.row.level==1"  type="success">二级</el-tag>
                <el-tag v-else type="warning">三级</el-tag>
            </template>
            </el-table-column>
        </el-table>
        </el-card>
    </div>
</template>
<script>
export default {
    created(){
        this.getRightsList()
    },
    methods:{
        async getRightsList(){
            //发送axios
            const {data:dt} = await this.$http.get('rights/list')
            if (dt.meta.status !==200) {
                return this.$message.error(dt.meta.msg)
            }
            this.rightsList = dt.data
        }
    },
    data(){
        return {
            rightsList:[]
        }
    }
}
</script>
<style lang = "less" scoped>

</style>