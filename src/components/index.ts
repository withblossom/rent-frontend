import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: any) {
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
