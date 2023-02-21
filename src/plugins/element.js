// import ElementPlus from 'element-plus'
import { Menu as IconMenu, Message, Setting } from '@element-plus/icons-vue'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
export default (app) => {
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  // app.use(ElementPlus)
  app.use(IconMenu, Message, Setting)
}
