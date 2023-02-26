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
                    <el-tabs v-model="stepFlag" :before-leave="beforeTabLeave" @tab-click="tabClicked" tab-position="left" class="demo-tabs">
                        <el-tab-pane label="基本信息" name='0' class="baseInfo">
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
                        <el-tab-pane label="商品参数" name='1'>
                          <el-form-item v-for="item in state.manyTable" :key="item.attr_id" :label="item.attr_name">
                            <!-- 渲染每个属性值的复选框 -->
                            <el-checkbox-group v-model="item.attr_vals">
                              <el-checkbox v-for="(val,index) in item.attr_vals" :key="index" :label="val" border />
                            </el-checkbox-group>
                          </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品属性" name='2'>
                          <el-form-item v-for="item in state.onlyTable" :key="item.attr_id" :label="item.attr_name">
                              <el-input v-model="item.attr_vals" />
                            </el-form-item>
                        </el-tab-pane>
                        <el-tab-pane label="商品图片" name='3'>
                          <!-- action 上传的接口地址 -->
                          <el-upload
                            ref="uploadRef"
                            v-model:file-list="uploadPic"
                            class="upload-demo"
                            action='http://43.139.223.94:8889/api/private/v1/upload'
                            list-type="picture"
                            :headers="headerObj"
                            :on-success="handleUpload"
                            :on-remove="handleRemove"
                            :auto-upload="false"
                          >
                            <el-button type="primary">Click to upload</el-button>
                            <template #tip>
                              <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                              </div>
                            </template>
                          </el-upload>
                        </el-tab-pane>
                        <el-tab-pane label="商品内容" name='4'>
                          <el-form-item label="商品介绍" >
                            <mavon-editor v-model="state.addform.goods_introduce"/>
                              <!-- <el-input v-model="state.addform.goods_introduce" show-word-limit type="textarea" maxlength="100"/> -->
                            <el-button type="primary" class="addBtn"  @click="addGood">添加商品</el-button>
                          </el-form-item>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </div>
        </div>

</el-card>
</template>

<script setup>
import _ from 'lodash'
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
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
    goods_cat: '',
    goods_introduce: '',
    pics: [],
    attrs: []
  },
  manyTable: [], // 动态属性列表
  onlyTable: [] // 静态态属性列表
})
// 1.基本信息
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
// 2.参数分类
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
// 级联选择器被选中时触发，判断选中了第几级
const CategoriesChange = () => {
  if (state.addform.goods_cat.length !== 3) {
    state.addform.goods_cat = []
  }
  // console.log(state.addform.goods_cat)
}
// tabs 离开钩子
const beforeTabLeave = (activeName, oldActiveName) => {
  if ((oldActiveName === '0' && state.addform.goods_cat.length !== 3) || state.addform.goods_name === '') {
    ElMessage.error('先填写完基本信息')
    return false
  }
}

// 图片上传组件验证请求头
const headerObj = {
  Authorization: window.sessionStorage.getItem('token')
}
const uploadPic = []
// 获得上传成功的返回值
const handleUpload = (response) => {
  const picInfo = { pic: response.data.url }
  state.addform.pics.push(picInfo)
  console.log(response.data)
  ElMessage.success('upload图片成功!')
  // console.log(activeName, oldActiveName)
}
// 移除图片
const handleRemove = (file) => {
  console.log(file.response.data.tmp_path)
  // 1.拿到移除图片的路径
  const removePath = file.response.data.tmp_path
  // 1.去找addform.pics的索引值
  const i = state.addform.pics.findIndex(x => x.pic === removePath)
  state.addform.pics.splice(i, 1)
  console.log(uploadPic)
}
// 3.商品属性
// 点击tabs
const tabClicked = async (TabsPaneContext) => {
  // console.log(TabsPaneContext.index)
  switch (TabsPaneContext.index) {
    case '1':
      if (state.addform.goods_cat.length !== 3) { break }
      // eslint-disable-next-line no-case-declarations
      const atrr = { sel: 'many' }
      // eslint-disable-next-line no-case-declarations
      const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get(`categories/${state.addform.goods_cat[2]}/attributes`
        , { params: atrr })
      if (res.meta.status !== 200) {
        return ElMessage.error('获取商品列表失败')
      }
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
      })
      state.manyTable = res.data
      break

    case '2':
      // eslint-disable-next-line no-case-declarations
      const atrronly = { sel: 'only' }
      // eslint-disable-next-line no-case-declarations
      const { data: result } = await internalInstance.appContext.config.globalProperties.$http.get(`categories/${state.addform.goods_cat[2]}/attributes`
        , { params: atrronly })
      if (result.meta.status !== 200) {
        return ElMessage.error('获取商品列表失败')
      }
      // console.log(result.data)
      state.onlyTable = result.data
      break
    default:
      break
  }
}
// 4. 商品内容 富文本编辑器
const router = useRouter()
const uploadRef = ref()
const submitUpload = () => {
  uploadRef.value.submit()
}
const ruleFormRef = ref(null)
const addGood = async () => {
  ruleFormRef.value.validate(async (valid) => {
    if (!valid) {
      return
    }
    // 先上传图片回调函数修改state.addform,pics后才能提交添加
    new Promise(function (resolve) {
      submitUpload()
      setTimeout(function () {
        resolve()
      }, 100)
    }).then(async () => {
      // 提交前的业务逻辑
      // 深拷贝一份 不影响双向绑定的UI组件内容
      const form = _.cloneDeep(state.addform)
      // 拼接类别id变成一个逗号分隔的字符串
      form.goods_cat = form.goods_cat.join(',')
      // 处理动态参数
      state.manyTable.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals.join(' ') }
        state.addform.attrs.push(newInfo)
      })
      // 处理静态参数
      state.onlyTable.forEach(item => {
        const newInfo = { attr_id: item.attr_id, attr_vals: item.attr_vals }
        state.addform.attrs.push(newInfo)
      })
      form.attrs = state.addform.attrs
      console.log(form)
      const { data: result } = await internalInstance.appContext.config.globalProperties.$http.post('goods', form)
      console.log(result)
      if (result.meta.status !== 201) {
        return ElMessage.error(`添加商品失败: ${result.meta.msg}`)
      }
      ElMessage.success(`${result.meta.msg}`)
      router.push('/goods')
    })
  })
}
</script>
<style scoped lang='less'>
.demo-tabs .baseInfo .el-input{
  width: 50%;
}
.step-list{
    margin-top: 20px;
}
.content{
    margin-top: 30px;
    .el-tab-pane{
        width: 95%;
    }
}
.el-checkbox{
  margin: 0 5px 0 0 !important;
}
.addBtn{
  margin-top: 30px;
}
</style>
