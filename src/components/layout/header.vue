<!-- eslint-disable vue/multi-word-component-names -->
<!--  -->
<template>
  <div class="headercontent">
    <span>PP Love manage system</span>
        <div class="toolbar">
          <el-dropdown>
            <div class="userIcon">
              <el-icon><UserFilled /></el-icon>
            <span>{{ userInfo.username }}</span>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="logout"><el-icon><SwitchButton /></el-icon>Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
  </div>

</template>

<script setup>
import { useRouter } from 'vue-router'
import { useUsersStore } from '../../store/user'
import { storeToRefs } from 'pinia'
// import { reactive, ref, onMounted} from 'vue'
// 用户属性存储到store
const store = useUsersStore()
const { userInfo } = storeToRefs(store)

const router = useRouter()
const logout = () => {
  window.sessionStorage.clear()
  store.$reset()
  router.push('/login')
}
</script>
<style scoped lang='less'>
.headercontent {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
  padding-left: 5px;
  font-size: 16px;
  user-select: none;
}

 .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  align-items: center;
}
</style>
