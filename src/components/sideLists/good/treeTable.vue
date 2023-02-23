<!-- eslint-disable quotes -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/no-unused-vars -->
<!-- // -->
<!-- eslint-disable vue/multi-word-component-names -->
<!--  -->
<template>
    <!-- tree -->
    <el-card>
      <el-tree :default-expanded-keys="[1]" :expand-on-click-node="false" :data="state.cateList" node-key="cat_id" :props="defaultProps">
        <template #default="{ node, data }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>

              <div class="btns">
              <el-button v-if="data.cat_level!==0" type="text" @click.prevent="edit(node, data)" style="color: green; margin-left: 8px"><el-icon><Edit /></el-icon>Edit</el-button>
              <el-button v-if="!data.children && data.cat_level!==2" type="text" @click.prevent="addChild(node, data)" style="color: #E6A23C; margin-left: 8px"><el-icon><Share /></el-icon>Add child</el-button>
              <el-button v-if="data.cat_level!==0" type="text" @click.prevent="add(node, data)" style="margin-left: 8px"><el-icon><CirclePlus /></el-icon>Add</el-button>
              <el-button type="text" @click.prevent="remove(node, data)" style="color: red; margin-left: 8px"><el-icon><Delete /></el-icon>Delete</el-button>
              </div>

          </span>
        </template>
      </el-tree>
      <!-- 分页 -->
      <br>
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20,50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
        >
        </el-pagination>
    </el-card>

  <div>
    <!-- 编辑分类dialog -->
    <el-dialog
        title="编辑分类"
        v-model="dialogVisible"
        width="30%"
      >
      <span>
        <el-form
          ref="addroles"
          :model="editItem"
          label-width="70px"
        >
          <el-form-item label="id" prop="cat_id">
            <el-input disabled v-model="editItem.cat_id"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="cat_name">
            <el-input v-model="editItem.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="isEdit">确 定</el-button>
          </span>
        </template>
    </el-dialog>
    <!-- 添加分类dialog -->
    <el-dialog
        :title=diaDilogContent
        v-model="dialogAdd"
        width="30%"
      >
      <span>
        <el-form
          ref="CateForm"
          :model="addItem"
          label-width="70px"
        >
          <el-form-item label="分类层级" prop="cat_level">
            <el-input disabled v-model="addItem.cat_level"></el-input>
          </el-form-item>
          <!-- <el-form-item label="父 ID" prop="cat_pid">
            <el-input disabled v-model="addItem.cat_pid"></el-input>
          </el-form-item> -->
          <el-form-item label="名称" prop="cat_name">
            <el-input v-model="addItem.cat_name"></el-input>
          </el-form-item>
        </el-form>
      </span>

        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogAdd = false">取 消</el-button>
            <el-button type="primary" @click="isAdd">确 定</el-button>
          </span>
        </template>
    </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

const state = reactive({
  cateList: [],
  total: 0
})
// 获取分类列表
const internalInstance = getCurrentInstance()
const queryInfo = reactive({
  type: 3, // [1,2,3] 分类级别
  pagenum: 1,
  pagesize: 20
})

const getCategories = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('categories', {
    params: queryInfo
  })
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品列表失败')
  }
  state.total = res.data.total
  state.cateList = res.data.result
}
getCategories()
// 翻页换页
const handleSizeChange = (newValue) => {
  queryInfo.pagesize = newValue
  getCategories()
}
const handleCurrentChange = (newValue) => {
  queryInfo.pagenum = newValue
  getCategories()
}
// 树形结构解析规则
const defaultProps = {
  children: 'children',
  label: 'cat_name'
}
// 编辑分类dialog
const dialogVisible = ref(false)
let editItem = reactive({})
const edit = (node, data) => {
  dialogVisible.value = true
  editItem = data
}
// 确认分类修改
const isEdit = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.put(`categories/${editItem.cat_id}`, { cat_name: editItem.cat_name })
  if (res.meta.status !== 200) {
    return ElMessage.error(`修改 ${editItem.cat_name} 失败`)
  }
  dialogVisible.value = false
  getCategories()
  return ElMessage.success('修改成功')
}
// 添加分类dialog
const dialogAdd = ref(false)
// eslint-disable-next-line prefer-const
let addItem = reactive({
  cat_pid: '',
  cat_level: '',
  cat_name: ''
})
let diaDilogContent = ref('')
const add = (node, data) => {
  diaDilogContent = `将在“${node.parent.data.cat_name}”下创建子分类`
  addItem.cat_pid = data.cat_pid
  addItem.cat_level = data.cat_level
  dialogAdd.value = true
}
// 确认添加分类
const CateForm = ref(null)
const isAdd = async () => {
  if (CateForm.value !== null) {
    const { data: res } = await internalInstance.appContext.config.globalProperties.$http.post('categories', addItem)
    if (res.meta.status !== 201) {
      return ElMessage.error(`添加 ${addItem.cat_name} 失败`)
    }
    dialogAdd.value = false
    getCategories()
    ElMessage.success('添加分类成功' + editItem.cat_name)
    editItem.cat_name = ''
  }
}
// 添加子类
const addChild = (node, data) => {
  // console.log(node)
  // console.log(data)
  diaDilogContent = `将在“${data.cat_name}”下创建子分类`
  addItem.cat_pid = data.cat_id
  addItem.cat_level = data.cat_level + 1
  dialogAdd.value = true
}
// 删除分类操作
const remove = async (node, data) => {
  const confirms = ElMessageBox
  const result = await confirms
    .confirm(`删除分类： ${data.cat_name}? `, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err) => ElMessage.error(err))
  if (result !== 'confirm') {
    return ElMessage.info('已取消删除操作')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.delete(`categories/${data.cat_id}`)
  if (res.meta.status !== 200) {
    return ElMessage.error(`删除 ${data.cat_name} 失败`)
  }
  getCategories()
  return ElMessage.success(`删除 ${data.cat_name} 成功`)
}
</script>
<style scoped lang='less'>
.el-card{
  margin-top: 20px;
  width: 80%;
}
.cate-table{
  margin-top: 20px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;

}
</style>
