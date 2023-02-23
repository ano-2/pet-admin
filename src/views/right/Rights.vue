<!-- eslint-disable vue/multi-word-component-names -->
<!--  -->
<template>
    <!-- 面包屑 start -->
    <Bread :breadlist="breadList"/>
    <!-- 面包屑 end -->
    <div class="right-table">
        <el-card>
            <el-table :data="state.rightsList" border style="width: 100%" stripe fit>
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="authName" label="权限名称"> </el-table-column>
                <el-table-column prop="path" label="路径"> </el-table-column>
                <el-table-column prop="level" label="权限等级">
                <template v-slot="power">
                    <el-tag v-if="power.row.level === '0'">等级一</el-tag>
                    <el-tag v-if="power.row.level === '1'" type="success">等级二</el-tag>
                    <el-tag v-if="power.row.level === '2'" type="info">等级三</el-tag>
                </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>

  </template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import Bread from '@/components/sideLists/bread.vue'
// 面包屑
const breadList = [{
  id: 1,
  name: '首页',
  path: '/home'
}, {
  id: 2,
  name: '权限管理',
  path: '/users'
}, {
  id: 3,
  name: '权限列表',
  path: '/users'
}]
const state = reactive({
  rightsList: []
})
const internalInstance = getCurrentInstance()
const getRightsList = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('rights/list')
  if (res.meta.status !== 200) {
    return ElMessage.error('获取权限列表失败')
  }
  state.rightsList.push(...res.data)
}
getRightsList()

</script>

<style lang="less" scoped>

.el-card{
  margin-top: 20px;
}
.right-table{
  margin-top: 20px;
}
</style>
