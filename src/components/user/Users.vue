<template>
    <div>
<!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card">
        <!-- 搜索与添加区域 栅栏布局 -->
        <el-row :gutter="20">
        <el-col :span="6">
             <el-input placeholder="请输入姓名" clearable v-model="queryInfo.key_words">
            <el-button slot="append" icon="el-icon-search" @click="search_user"></el-button>
        </el-input>
        </el-col>
        <el-col :span="6">
            <el-button type="primary" @click="addUserDialog = true">添加用户</el-button>
        </el-col>
        </el-row>

        <!-- 用户列表区域 -->
        <el-table
            :data="userList"
            border
            style="width: 100%">
            <!-- 索引列 -->
            <el-table-column
            type="index"
            label="序号"
            width="180">
            </el-table-column>
            <!-- 数据列 -->
            <el-table-column
            prop="fullname"
            label="姓名"
            width="180">
            </el-table-column>
            <el-table-column
            prop="mobile"
            label="联系电话"
            width="180">
            </el-table-column>
            <el-table-column
            prop="email"
            label="邮箱">
            </el-table-column>
            <el-table-column
            prop="password"
            label="密码">
            </el-table-column>
            <!-- 将状态的值转换成开关 -->
            <el-table-column
            prop="status"
            label="状态">
            <template slot-scope="scope">
                <el-switch
                v-model="scope.row.status"
                @change="changeUserStatus(scope.row)">
                </el-switch>
            </template>
            </el-table-column>
            <!-- 操作列数据 -->
            <el-table-column
            label="操作">
            <template slot-scope="scope">
                <!-- 编辑按钮 -->
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                <!-- 删除按钮 -->
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUser(scope.row.id)"></el-button>
                <!-- 设置按钮,鼠标悬停增加文字 -->
                 <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                    <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                </el-tooltip>
            </template>
            </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 添加用户对话框区域 -->
    <el-dialog
    title="添加用户"
    :visible.sync="addUserDialog"
    width="50%" 
    @close="addDialogClose">
    <!-- 内容主体区域 -->
    <el-form :model="addForm" :rules="addRule" ref="addFormRef" label-width="70px">
  <el-form-item label="姓名" prop="username">
    <el-input v-model="addForm.username"></el-input>
  </el-form-item>
    <el-form-item label="密码" prop="password">
    <el-input v-model="addForm.password"></el-input>
  </el-form-item>
    <el-form-item label="邮箱" prop="email">
    <el-input v-model="addForm.email"></el-input>
  </el-form-item>
    <el-form-item label="手机号" prop="mobile">
    <el-input v-model="addForm.mobile"></el-input>
  </el-form-item>
  </el-form>

    <!-- 底部区域 -->
    <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
    </span>
    </el-dialog>
    </el-card>
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule,value,cb) => {
            // 验证邮箱的正则
             const verify = /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
            if (verify.test(value)){
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }
        // 验证手机号的规则
        var checkMobile = (rule,value,cb) => {
                console.log(value)
                // 验证手机号规则
                const reg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
                if (reg.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法手机号'))
        }

        return {
            userList: [],
            total: 0,
            queryInfo: {
                key_words: '',
                // 当前多少页
                pagenum: 1,
                // 当前显示每页多少条数据
                pagesize: 10,
                offset: 0
            },
            // 控制对话框的显示
            addUserDialog: false,
            // 添加用户的表单区
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            // 添加表单的验证规则
            addRule: {
               username: [{ min: 3,max: 5 }],
               email: [{ validator: checkEmail,trigger: 'blur' }],
               mobile: [{ validator: checkMobile,trigger: 'blur' }]
            }
        }
    },
    created() {
        // 获取用户列表
        this.getUserList()
    },
    methods: {
    // 获取菜单
    async getUserList(){
       const { data: res } = await this.$http.get('userlist',{ params: { 'limit': this.queryInfo.pagesize,'offset': this.queryInfo.offset } })
    //    if (res.code !== 200) return this.$message.error('获取用户列表失败')
       this.userList = res.results
       this.total = res.count
    },
    async search_user(){
       const { data: res } = await this.$http.get('userlist',{ params: { 'limit': this.queryInfo.pagesize,'fullname': this.queryInfo.key_words } })
    //    if (res.code !== 200) return this.$message.error('获取用户列表失败')
       this.userList = res.results
       this.total = res.count
    }, 
    // 监听页面改变
    handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getUserList()
    },
        // 监听页码值的事件
    handleCurrentChange(newPage) {
        this.queryInfo.offset = this.queryInfo.pagesize * (newPage-1)
         this.getUserList()
    },
    // 监听开关状态变化
    changeUserStatus(userinfo) {
        console.log(userinfo)
    },
    // 对话框关闭处理
    addDialogClose() {
        this.$refs.addFormRef.resetFields()
    },
    addUser() {
        this.$refs.addFormRef.validate(valid =>{
            if (!valid) return 
            console.log(valid)
        })
    },
    // 删除用户
    async removeUser(id) {
        const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).catch(err => err)
        console.log(res)
        if (res !== 'confirm') { this.$message.info('取消删除') }
        this.$message.success('删除成功')
    }
    }
}
</script>

<style lang="less" scoped>

</style>