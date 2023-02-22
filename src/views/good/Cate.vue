<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<!--  -->
<template>

    <!-- 面包屑 start -->
    <Bread :breadlist="breadList"/>
    <!-- 面包屑 end -->
    <el-card>
      <template #header>
        <div class="card-header">
          <span>{{ breadList[2].name }}管理</span>
        </div>
      </template>
      <el-button type="success" size="small" @click="dialogAdd = true" >添加大类</el-button>
    </el-card>
    <!-- treeTable start  -->
    <treeTable/>
    <!-- treeTable end  -->
    <!-- 添加大类 dialog -->
    <el-dialog
        title="添加大类"
        v-model="dialogAdd"
        width="30%"
      >
      <span>
        <el-form
          ref="CateForm"
          :model="addItem"
          label-width="70px"
          :rules="addRules"
        >
          <el-form-item label="分类层级" prop="cat_level">
            <el-input disabled v-model="addItem.cat_level"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="cat_name">
            <el-input v-model="addItem.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeCateDia">取 消</el-button>
            <el-button type="primary" @click="addCate">确 定</el-button>
          </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import Bread from '@/components/sideLists/bread.vue'
import treeTable from '@/components/sideLists/good/treeTable.vue'
// 面包屑
const breadList = reactive([{
  id: 1,
  name: '首页',
  path: '/home'
}, {
  id: 2,
  name: '商品管理'
}, {
  id: 3,
  name: '商品分类',
  path: '/categories'
}])
// 添加大类dialog
const dialogAdd = ref(false)
const CateForm = ref(null)
const addRules = reactive({
  cat_name: [
    { required: true, message: '不能为空', trigger: 'blur' },
    { min: 1, max: 16, message: '长度在 1 到 16 个字符', trigger: 'blur' }
  ]
})
const addItem = reactive({
  cat_pid: 0,
  cat_level: 0,
  cat_name: ''
})
const internalInstance = getCurrentInstance()
const addCate = async () => {
  if (CateForm.value !== null) {
    CateForm.value.validate(async (valid) => {
      if (!valid) return
      const { data: res } = await internalInstance.appContext.config.globalProperties.$http.post(
        'categories',
        addItem
      )
      if (res.meta.status !== 201) {
        ElMessage.error('添加用户失败')
      }
      ElMessage.success('添加用户成功')
      dialogAdd.value = false
    })
  }
}
const closeCateDia = () => {
  addItem.cat_name = ''
  dialogAdd.value = false
}
</script>
<style scoped lang='less'>
.el-card{
  margin-top: 20px;
  width: 50%;
}
.cate-table{
  margin-top: 20px;
}
</style>
