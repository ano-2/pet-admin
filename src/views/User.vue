<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!--  -->
<template>
    <!-- 面包屑 start -->
    <Bread :breadlist="breadList"/>
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
          <el-table-column prop="mg_state" label="状态" width="200">
            <template v-slot="scope">
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeState(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="Operations" width="150">
            <template #default="scope">
              <!-- edit 用户 -->
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
              <el-tooltip
                class="item"
                effect="dark"
                content="Set Role 设置角色"
                placement="top"
                :enterable="false"
              >
                <el-button  type="warning" icon="el-icon-setting" size="small" @click="setor(scope.row)" circle />
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
      <!-- 设置权限 -->
      <el-dialog title="设置权限" v-model="setorShow" width="30%">
    <div>
      <p>当前用户：{{ state.setRole.username }}</p>
      <p>当前角色：{{ state.setRole.role_name }}</p>
      <p>
        分配新角色：
        <el-select v-model="state.selectedRoleID" placeholder="请选择新角色">
          <el-option
            v-for="item in state.roleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            :disabled="item.roleName==state.setRole.role_name"
          >
          </el-option>
        </el-select>
      </p>
    </div>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="setorShow = false">取 消</el-button>
        <el-button type="primary" @click="confirmSetRole">确 定</el-button>
      </span>
    </template>
  </el-dialog>
    </div>

</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUsersStore } from '@/store/user'
import Bread from '@/components/sideLists/bread.vue'

// 面包屑
const breadList = [{
  id: 1,
  name: '首页',
  path: '/home'
}, {
  id: 2,
  name: '用户管理',
  path: '/users'
}, {
  id: 3,
  name: '用户列表',
  path: '/users'
}]
const store = useUsersStore()

const state = reactive({
  userLists: [],
  total: 0,
  editForm: {},
  setRole: {},
  selectedRoleID: ''
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
// 改变用户状态
const changeState = async (userinfo) => {
  if (store.userInfo.rid !== 0) {
    userinfo.mg_state = !userinfo.mg_state
    return ElMessage.error('权限不足')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
  )
  if (res.meta.status !== 200) {
    userinfo.mg_state = !userinfo.mg_state
    return ElMessage.error('更新用户状态失败')
  }

  ElMessage.success('更新用户状态成功')
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
    return ElMessage.info('已取消删除操作')
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
// 添加用户

const isAddUsers = () => {
  if (addroles.value !== null) {
    addroles.value.validate(async (valid) => {
      if (!valid) return
      const { data: res } = await internalInstance.appContext.config.globalProperties.$http.post(
        'users',
        addUserInfo
      )
      if (res.meta.status !== 201) {
        return ElMessage.error('添加用户失败')
      }
      ElMessage.success('添加用户成功')
      // 初始赋予游客角色 rid: 42
      await internalInstance.appContext.config.globalProperties.$http.put(
      `users/${res.data.id}/role`, { rid: 42 })
      dialogVisible.value = false
      getUserList()
    })
  }
}
// 修改角色
const setorShow = ref(false)
const setor = async (user) => {
  state.setRole = user
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('roles')
  if (res.meta.status !== 200) {
    return ElMessage.error('获取用户列表失败')
  }
  state.roleList = res.data
  setorShow.value = true
}
const confirmSetRole = async () => {
  if (!state.selectedRoleID) { return ElMessage.error('请选择一个角色') }
  if (!state.selectedRoleID) {
    return ElMessage.error('请选择一个角色')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.put(`users/${state.setRole.id}/role`,
    { rid: state.selectedRoleID })
  if (res.meta.status !== 200) {
    return ElMessage.error('修改管理员权限失败')
  }
  setorShow.value = false
  getUserList()
  ElMessage.success('修改管理员权限成功')
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
