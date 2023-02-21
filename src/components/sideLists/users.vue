<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<!--  -->
<template>
    <!-- 面包屑 start -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 面包屑 end -->
    <el-card>
      <el-row :gutter="30">
        <el-col :span="9">
          <el-input
            placeholder="搜索用户"
            class="input-with-select"
            v-model="userParm.query"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template> </el-input>
          </el-col>
        <el-col :span="9"><el-button type="success" @click="addusers" round><el-icon><plus /></el-icon>添加用户</el-button></el-col>
      </el-row>
      </el-card>
    <!-- table -->
    <div class="user-table">
      <el-card class="box-card">
        <el-table :data="state.userLists" style="width: 100%" stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="username" label="用户名" width="200"></el-table-column>
          <el-table-column prop="email" label="邮箱" width="200"> </el-table-column>
          <el-table-column prop="mobile" label="电话" width="200"></el-table-column>
          <el-table-column prop="role_name" label="角色" width="200"></el-table-column>
          <el-table-column prop="mg_state" label="状态" width="200"></el-table-column>
          <el-table-column fixed="right" label="Operations" width="200">
            <template #default="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Edit 编辑"
                placement="top"
                :enterable="false"
              >
                <el-button type="primary" icon="el-icon-edit" @click="editor(scope.row)" size="small" circle />
              </el-tooltip>
              <!-- 删除用户 -->

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Delete 删除"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button  type="danger" icon="el-icon-delete" @click="deleteor(scope.row)" size="small" circle />
                  </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <br>
        <!-- 分页部分 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="userParm.pagenum"
          :page-sizes="[10, 20]"
          :page-size="userParm.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
        >
        </el-pagination>
        <!-- 分页部分 end-->
      </el-card>
      <!-- table end -->
      <!-- dialog  修改用户-->
      <el-dialog
        title="修改用户"
        v-model="editorShow"
        width="30%"
        @close="editFormClose"
      >
        <el-form
          :model="state.editForm"
          :rules="editRules"
          ref="editruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名">
            <el-input v-model="state.editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="state.editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="state.editForm.mobile"></el-input>
          </el-form-item> </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editorShow = false">取 消</el-button>
              <el-button type="primary" @click="commitEditForm">确 定</el-button>
            </span>
        </template>
      </el-dialog>
      <!-- 添加用户 -->
      <el-dialog
        title="添加用户"
        v-model="dialogVisible"
        width="30%"
        @close="reset"
      >
      <span>
        <el-form
          ref="addroles"
          :model="addUserInfo"
          label-width="70px"
          :rules="addRules"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addUserInfo.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addUserInfo.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addUserInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addUserInfo.mobile"></el-input>
          </el-form-item>
        </el-form>
      </span>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="isAddUsers">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>

</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUsersStore } from '../../store/user'

const store = useUsersStore()

const state = reactive({
  userLists: [],
  total: 0,
  editForm: {}
})
// 请求管理员参数
const userParm = reactive({
  query: '',
  pagenum: 1,
  pagesize: 10
})
// 获取管理员
const internalInstance = getCurrentInstance()
const getUserList = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('users', { params: userParm })

  if (res.meta.status !== 200) {
    return ElMessage.error('get managesLists fail!')
  } else {
    ElMessage.success('get managesLists successful !')
    state.userLists = res.data.users
    state.total = res.data.total
  }
}
getUserList()
// 翻页换页
const handleSizeChange = (newValue) => {
  userParm.pagesize = newValue
  getUserList()
}
const handleCurrentChange = (newValue) => {
  userParm.pagenum = newValue
  getUserList()
}

// 修改用户 edit user
const editorShow = ref(false)
const editruleForm = ref(null)
const checkEmail = (rule, value, callback) => {
  const regEmail =
        /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
  if (regEmail.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的邮箱'))
}
const checkMobile = (rule, value, callback) => {
  const regMobile =
        /^\d{8,11}$/
  if (regMobile.test(value)) {
    return callback()
  }
  callback(new Error('请输入合法的8-11位手机号'))
}
const editRules = reactive({
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ]
})
const editor = async (row) => {
  if (store.userInfo.rid === 0 || row.id === store.userInfo.id) {
    editorShow.value = true
    const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('users/' + row.id)
    if (res.meta.status !== 200) {
      return ElMessage.error('查找用户失败')
    }
    state.editForm = res.data
  } else return ElMessage.error('无法修改其他用户的信息')
}
// 修改对话框关闭回调
const editFormClose = () => {
  if (editruleForm.value !== null) {
    editruleForm.value.resetFields()
  }
}
// 提交修改
const commitEditForm = () => {
  if (editruleForm.value !== null) {
    editruleForm.value.validate(async (valid) => {
      if (!valid) {
        return
      }
      const { data: res } = await internalInstance.appContext.config.globalProperties.$http.put(
        'users/' + state.editForm.id,
        {
          id: state.editForm.id,
          email: state.editForm.email,
          mobile: state.editForm.mobile
        }
      )
      if (res.meta.status !== 200) {
        return ElMessage.error('更新失败')
      }
      ElMessage.success('更新成功')
      getUserList()
      editorShow.value = false
    })
  }
}

// 删除用户确认
const deleteor = async (row) => {
  if (store.userInfo.rid !== 0) return ElMessage.error('权限不足')
  const confirms = ElMessageBox
  const result = await confirms
    .confirm('此操作将永久删除该用户, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .catch((err) => ElMessage.error(err))

  if (result !== 'confirm') {
    return internalInstance.appContext.config.globalProperties.$http.info('已取消删除操作')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.delete('users/' + row.id)
  if (res.meta.status !== 200) {
    return ElMessage.error('删除失败')
  }
  getUserList()
  return ElMessage.success('删除成功')
}
// 添加用户
const dialogVisible = ref(false)
const addusers = () => {
  dialogVisible.value = true
}
const addUserInfo = reactive({
  username: '',
  password: '',
  email: '',
  mobile: ''
})
const addRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 16, message: '长度在 3 到 16 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { validator: checkEmail, trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: checkMobile, trigger: 'blur' }
  ]
})
const addroles = ref(null) // el-form的ref
const reset = () => {
  if (addroles.value !== null) {
    addroles.value.resetFields()
  }
}
const isAddUsers = () => {
  if (addroles.value !== null) {
    addroles.value.validate(async (valid) => {
      if (!valid) return
      const { data: res } = await internalInstance.appContext.config.globalProperties.$http.post(
        'users',
        addUserInfo
      )
      if (res.meta.status !== 201) {
        ElMessage.error('添加用户失败')
      }
      ElMessage.success('添加用户成功')
      dialogVisible.value = false
    })
  }
}
</script>
<style scoped lang='less'>
.el-card{
  margin-top: 20px;
}
.user-table{
  margin-top: 20px;
}
</style>
