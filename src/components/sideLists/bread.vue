<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable no-unused-vars -->
<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <!-- 面包屑 start -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
        :index="i.id"
        v-for="i in breadlist"
        :key="i.id" :to=i.path>{{ i.name }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
const props = defineProps({
  breadlist: Array
})
</script>
