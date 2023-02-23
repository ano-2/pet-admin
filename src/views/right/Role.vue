<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!--  -->
<template>
    <!-- 面包屑 start -->
    <Bread :breadlist="breadList"/>
    <!-- 面包屑 end -->
    <div class="addrole">
        <el-card>
            <el-row><el-button size="small" type="success" @click="isAddRole">添加角色</el-button></el-row>
        </el-card>
    </div>

    <!-- table -->
    <div class="user-table">
      <el-card class="box-card">
        <el-table :data="state.roleList" style="width: 100%" stripe fit>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名称" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column fixed="right" label="Operations" width="150">
                <template #default="scope">
                    <!-- edit  -->
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="Edit 编辑"
                        placement="top"
                        :enterable="false"
                    >
                        <el-button type="primary" icon="el-icon-edit" @click="isEditRole(scope.row)"  size="small" circle />
                    </el-tooltip>
                    <!-- 删除 -->
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="Delete 删除"
                        placement="top"
                        :enterable="false"
                    >
                        <el-button  type="danger" icon="el-icon-delete" @click="deleteor(scope.row.id)" size="small" circle />
                    </el-tooltip>
                    <!-- set Role -->
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content="Set Role 设置"
                        placement="top"
                        :enterable="false"
                    >
                        <el-button  type="warning" icon="el-icon-setting" size="small" circle />
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

      </el-card>
      <!-- table end -->
    </div>
    <!-- add role dialog -->
    <el-dialog title="添加角色" v-model="roleForm" width="30%">
        <el-form :model="roleInfo" ref="addRoleRef">
          <el-form-item label="角色名称">
            <el-input v-model="roleInfo.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="roleInfo.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="colseRoleDialog">取 消</el-button>
            <el-button type="primary" @click="commitAddRole">确 定</el-button>
          </span>
        </template>
    </el-dialog>
    <!-- edit role dialog -->
    <el-dialog title="编辑角色" v-model="editRoleForm" width="30%">
        <el-form :model="Editole" ref="editRoleRef">
          <el-form-item label="角色名称">
            <el-input v-model="Editole.roleName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="Editole.roleDesc" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="colseEditDialog">取 消</el-button>
            <el-button type="primary" @click="commitEditRole">确 定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
// import { ElMessage } from 'element-plus'
import Bread from '@/components/sideLists/bread.vue'

// 面包屑
const breadList = [{
  id: 1,
  name: '首页',
  path: '/home'
}, {
  id: 2,
  name: '权限管理'
}, {
  id: 3,
  name: '角色管理'
}]

const state = reactive({
  roleList: [],
  roleInfo: {}
})
// 获取角色列表
const internalInstance = getCurrentInstance()
const getRoleList = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('roles')
  if (res.meta.status !== 200) {
    return ElMessage.error('获取角色列表失败')
  }
  state.roleList = res.data
}
getRoleList()
// 添加角色
const roleInfo = reactive({
  roleName: '',
  roleDesc: '',
  roleId: ''
})

const roleForm = ref(false)
const isAddRole = () => {
  roleForm.value = true
}
const commitAddRole = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.post('roles', roleInfo)
  if (res.meta.status !== 201) {
    return ElMessage.error('添加角色失败:' + res.meta.msg)
  }
  roleForm.value = false
  getRoleList()
  return ElMessage.success('添加角色成功')
}
const colseRoleDialog = () => {
  roleForm.value = false
  roleInfo.roleName = ''
  roleInfo.roleDesc = ''
}
// 编辑角色
const Editole = reactive({
  roleName: '',
  roleDesc: ''
})

const editRoleForm = ref(false)
const isEditRole = (row) => {
  state.roleId = row.id
  Editole.roleName = row.roleName
  Editole.roleDesc = row.roleDesc
  editRoleForm.value = true
}
const commitEditRole = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.put('roles/' + state.roleId, Editole)
  if (res.meta.status !== 200) {
    return ElMessage.error('编辑角色失败:' + res.meta.msg)
  }
  colseEditDialog()
  getRoleList()
  return ElMessage.success('编辑角色成功')
}
const colseEditDialog = () => {
  editRoleForm.value = false
  Editole.roleName = ''
  Editole.roleDesc = ''
}
// 删除角色
const deleteor = async (id) => {
  const confirms = ElMessageBox
  const result = await confirms
    .confirm('此操作将永久删除该角色, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .catch((err) => err)

  if (result !== 'confirm') {
    return ElMessage.info('已取消删除操作')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.delete('roles/' + id)
  if (res.meta.status !== 200) {
    return ElMessage.error('删除角色失败')
  }
  getRoleList()
  return ElMessage.success('删除角色成功')
}
</script>
<style scoped lang='less'>
.addrole .el-card{
    width: 30%;
    margin-top: 20px;
}
.user-table .el-card{
    width: 80%;
}
.user-table{
    margin-top: 20px;
}
</style>
