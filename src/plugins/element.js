// import ElementPlus from 'element-plus'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
// import { ElUpload, ElTable, ElTableColumn, ElCol, ElSwitch, ElAlert, ElTooltip, ElPagination, ElDialog, ElMessageBox, ElTag, ElTree, ElSelect, ElOption, ElOptionGroup, ElCascader, ElTabs, ElTabPane, ElAside, ElButton, ElHeader, ElBreadcrumb, ElInput } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default (app) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  // app.use(ElementPlus)
  app.use(IconMenu, Message, Setting)
}
