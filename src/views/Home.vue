<!-- eslint-disable vue/multi-word-component-names -->

<!-- eslint-disable no-unused-vars -->
<template>
  <el-container class="layout-container-demo" style="height: 100vh">
    <el-aside>
      <Sider/>

    </el-aside>
    <el-container>
      <el-header>
        <!-- header 组件 -->
        <Header/>
      </el-header>
      <!-- main 区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script  setup>
import Header from '@/components/layout/header.vue'
import Sider from '@/components/layout/sidebar.vue'

</script>

<style lang="less" scoped>
.layout-container-demo .el-header {
  background-color: var(--el-color-primary-light-7);
}

.layout-container-demo .el-aside {
  width: auto;
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
}

.layout-container-demo .el-main {
  padding: 20px;
}

</style>
