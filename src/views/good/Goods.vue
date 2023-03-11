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
            placeholder="搜索商品名"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <template #append>
              <el-button icon="el-icon-search" @click="getGoodsList"></el-button>
            </template> </el-input>
          </el-col>
        <el-col :span="9"><el-button type="success" @click="addGoods" round><el-icon><plus /></el-icon>添加商品</el-button></el-col>
      </el-row>
      </el-card>
    <!-- table -->
    <div class="user-table">
      <el-card class="box-card">
        <el-table :data="state.goodList" style="width: 100%" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column prop="goods_name" label="商品名称" width="200" ></el-table-column>
            <el-table-column prop="goods_price" label="商品价格"></el-table-column>
            <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
            <el-table-column prop="goods_number" label="商品数量"></el-table-column>
            <el-table-column prop="upd_time" label="更新时间"></el-table-column>
            <el-table-column prop="cat_id" label="类别id"></el-table-column>
          <el-table-column fixed="right" label="Operations" width="100">
            <template #default="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="Edit 编辑"
                placement="top"
                :enterable="false"
              >
                <el-button type="primary" icon="el-icon-edit" size="small" circle />
              </el-tooltip>
              <!-- 删除用户 -->

                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="Delete 删除"
                    placement="top"
                    :enterable="false"
                  >
                    <el-button  type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row.goods_id)" size="small" circle />
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
    </div>

  <div></div>
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import Bread from '@/components/sideLists/bread.vue'
import router from '@/router'
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
  console.log(res.data.goods)
  state.total = res.data.total
  state.goodList = res.data.goods
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
// 添加商品
const addGoods = () => {
  router.push('/addGood')
}
// 删除商品
const deleteGoods = async (id) => {
  const confirms = ElMessageBox
  const result = await confirms
    .confirm('此操作将永久删除该商品, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    .catch((err) => err)

  if (result !== 'confirm') {
    return ElMessage.info('已取消删除操作')
  }
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.delete(`goods/${id}`)
  if (res.meta.status !== 200) {
    return ElMessage.error('已取消删除操作')
  }
  getGoodsList()
  return ElMessage.success('删除成功')
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
