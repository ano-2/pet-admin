<!-- eslint-disable vue/multi-word-component-names -->

<!--  -->
<template>
    <el-card>
        <div class="ad-page">
            <div class="hint">
                <el-alert title="Add Good Item 添加商品信息" type="success" center show-icon  :closable="false"/>
            </div>
            <div class="step-list">
                <el-steps :active="stepFlag - 0" align-center finish-status="success">
                    <el-step title="基本信息" />
                    <el-step title="商品参数" />
                    <el-step title="商品属性" />
                    <el-step title="商品图片" />
                    <el-step title="商品内容" />
                </el-steps>
            </div>
            <div class="content">
                <el-form :model="state.addform" :rules="addRules" label-width="120px" label-position="top" ref="ruleFormRef" class="demo-ruleForm">
                    <el-tabs v-model="stepFlag" tab-position="left" class="demo-tabs">
                        <el-tab-pane label="基本信息" name='0'>
                            <el-form-item label="商品名称 name" prop="goods_name">
                                <el-input v-model="state.addform.goods_name" />
                            </el-form-item>
                            <el-form-item label="商品价格 prize"  prop="goods_price">
                                <el-input v-model.number="state.addform.goods_price" type="number"/>
                            </el-form-item>
                            <el-form-item label="商品数量 number"   prop="goods_number">
                                <el-input v-model.number="state.addform.goods_number" type="number"/>
                            </el-form-item>
                            <el-form-item label="商品重量 weight"  prop="goods_weight">
                                <el-input  v-model.number="state.addform.goods_weight" type="number" />
                            </el-form-item>
                            <el-form-item label="商品分类 Categories"  prop="goods_cat">
                                <el-cascader @change="CategoriesChange" v-model="state.addform.goods_cat" :options="state.cateList" :props="cateprops" size="large" placeholder="选择商品分类"/>
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品参数" name='1'></el-tab-pane>
                        <el-tab-pane label="商品属性" name='2'></el-tab-pane>
                        <el-tab-pane label="商品图片" name='3'></el-tab-pane>
                        <el-tab-pane label="商品内容" name='4'></el-tab-pane>
                    </el-tabs>
                </el-form>
            </div>
        </div>

</el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
// 步骤条和左侧菜单flag
const stepFlag = ref(0)

// 表
const state = reactive({
  cateList: [],
  addform: {
    goods_name: '',
    goods_price: 0,
    goods_number: 0,
    goods_weight: 0,
    goods_cat: ''
  }
})
// addRules 添加的表校验
const addRules = reactive({
  goods_name: [
    { required: true, message: '不能为空! need a value!', trigger: 'blur' },
    { min: 3, max: 30, message: 'Length should be 3 to 30', trigger: 'blur' }
  ],
  goods_price: [
    { required: true, message: '不能为空! need a value!', trigger: 'blur' },
    { type: 'number', message: 'age must be a number' }
  ],
  goods_number: [
    { required: true, message: '不能为空! need a value!', trigger: 'blur' },
    { type: 'number', message: 'age must be a number' }
  ],
  goods_weight: [
    { required: true, message: '不能为空! need a value!', trigger: 'blur' },
    { type: 'number', message: 'age must be a number' }
  ],
  goods_cat: [
    { required: true, message: '不能为空! need a value!', trigger: 'blur' }
  ]
})

// 获取分类列表
const internalInstance = getCurrentInstance()
const getCategories = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('categories')
  if (res.meta.status !== 200) {
    return ElMessage.error('获取商品列表失败')
  }
  state.cateList = res.data
}
getCategories()
// 级联选择器
// 规则
const cateprops = {
  expandTrigger: 'hover',
  label: 'cat_name',
  value: 'cat_id',
  children: 'children'
}
const CategoriesChange = () => {
  if (state.addform.goods_cat.length !== 3) {
    state.addform.goods_cat = []
  }
  console.log(state.addform.goods_cat)
}

</script>
<style scoped lang='less'>
.step-list{
    margin-top: 20px;
}
.content{
    margin-top: 30px;
    .el-tab-pane{
        width: 50%;
    }
}
</style>
