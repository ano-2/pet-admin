<!-- eslint-disable vue/multi-word-component-names -->

<!-- eslint-disable no-unused-vars -->
<template>
    <div class="sidebar" :width="isCollapse?'64px':'250px'">
        <el-scrollbar >
        <div class="btn" v-show="true" @click="changeCollapse" ><el-icon><Plus /></el-icon></div>
          <el-menu
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :collapse-transition="true"
          :default-active="activePath"
          :router="true"
        >
          <!-- 菜单项 -->
            <el-submenu
            :index="item.id + ''"
            v-for="item in menuList"
            :key="item.id"
            >
                <template #title>
                    <i :class="iconObj[item.id]"></i>
                    <span>{{ item.authName }}</span>
                </template>
                <!-- 子菜单 (遍历children) -->
                <el-menu-item
                :index="'' + child.path"
                v-for="child in item.children"
                :key="child.id"
                @click="saveNavState('/' + child.path)"
                >
                    <template #title>
                        <el-icon><Pointer /></el-icon>
                        <span>{{ child.authName }}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-scrollbar>
    </div>

  </template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'

// 获取菜单数据
const menuList = reactive([])
const internalInstance = getCurrentInstance()
const getMenuList = async () => {
  const { data: res } = await internalInstance.appContext.config.globalProperties.$http.get('menus')

  if (res.meta.status !== 200) {
    return ElMessage.error('获取菜单失败！ get Menu fail!')
  } else {
    // menuList.push(...res.data)
    const arr = [145, 102]
    res.data.forEach(element => {
      if (!arr.includes(element.id)) {
        menuList.push(element)
      }
    })
  }
}
getMenuList()
const iconObj = reactive({
  125: 'el-icon-user-solid',
  103: 'el-icon-view',
  101: 'el-icon-present',
  102: 'el-icon-document',
  145: 'el-icon-s-marketing'
})
// 当前点击菜单项
const activePath = ref('')
const saveNavState = (activePath) => {
  window.sessionStorage.setItem('activePath', activePath)
}
activePath.value = window.sessionStorage.getItem('activePath')

const isCollapse = ref(false)
const changeCollapse = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<style scoped lang='less'>
.sidebar{
    user-select: none;
    .el-menu {
        border-right: none;
        span{
        padding-left: 5px;
        }

    }
    .btn{
        text-align: center;
        line-height: 45px;
        height: 45px;
    }
    .el-aside {
    width: auto;
    color: var(--el-text-color-primary);
    background: var(--el-color-primary-light-8);
    }
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 250px;
  height: 100%;
}

  </style>
