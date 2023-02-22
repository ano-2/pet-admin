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
      <el-row :gutter="30">
        <el-col :span="9">
          <el-input
            placeholder="搜索用户"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
            </template> </el-input>
          </el-col>
        <el-col :span="9"><el-button type="success" @click="addusers" round><el-icon><plus /></el-icon>添加用户</el-button></el-col>
      </el-row>
      </el-card>
    <!-- table -->
    <div class="user-table">
      <el-card class="box-card">
        <el-table :data="state.goodList" style="width: 100%" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="200" >
            </el-table-column>
            <el-table-column prop="goods_price" label="商品价格">
            </el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="goods_number" label="商品数量"></el-table-column>
            <el-table-column prop="upd_time" label="更新时间"></el-table-column>
            <el-table-column prop="cat_id" label="类别id"></el-table-column>
            <el-table-column prop="cat_one_id" label="类别一级id"></el-table-column>
            <el-table-column prop="goods_state" label="状态" ></el-table-column>
          <el-table-column fixed="right" label="Operations" width="100">
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
          :current-page="queryInfo.pagenum"
          :page-sizes="[10, 20,50]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="state.total"
        >
        </el-pagination>
        <!-- 分页部分 end-->
      </el-card>
      <!-- table end -->
      <!-- dialog  修改用户-->
      <!-- <el-dialog
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
      </el-dialog> -->

    </div>

  <div></div>
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
  name: '商品管理',
  path: '/goods'
}, {
  id: 3,
  name: '商品列表',
  path: '/goods'
}]
// 获取商品列表
const internalInstance = getCurrentInstance()
const queryInfo = reactive({
  query: '',
  pagenum: 1,
  pagesize: 20
})
const state = reactive({
  goodList: [],
  total: 0
})
const getGoodsList = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('goods', {
    params: queryInfo
  })
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品列表失败')
  }
  state.total = res.data.total
  state.goodList = res.data.goods
  console.log(res.data)
//   state.total = res.data.total
}
getGoodsList()
// 翻页换页
const handleSizeChange = (newValue) => {
  queryInfo.pagesize = newValue
  getGoodsList()
}
const handleCurrentChange = (newValue) => {
  queryInfo.pagenum = newValue
  getGoodsList()
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
