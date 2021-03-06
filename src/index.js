import layouts from './layouts'
import { version } from '../package.json'

var _Vue = {}

/**
 * Install Plugin vue-extend-layout
 * 
 * @param {Vue} Vue 
 * @param {Object} [options={}] 
 */
export function VueExtendLayout (Vue, options = {}) {
  _Vue = Vue
  
  // Register layouts
  layouts().forEach(c => {
    c = c.default || c
    Vue.component(c.name, c)
  })
  
}

/**
 * Compile the layout
 *
 * @param {VueComponent} context Vue instance
 * @returns Compiled Component
 */
function layoutCompile (context) {
  return _Vue.compile(`<${(context.$route.meta.layout || 'default')} />`)
}

/**
 * Render the layout
 *
 * @param {VueComponent} context Vue instance
 * @param {Object} res Compiled Component
 * @param {Boolean} update To force update component layout
 */
function layoutRender (context, res, update) {
  context.$options.render = res.render
  context.$options.staticRenderFns = res.staticRenderFns
  if (update) context.$forceUpdate()
}

/**
 * Mixed to Vue root instance
 */
export const layout = {
  beforeCreate () {
    layoutRender(this, layoutCompile(this))
  },
  watch: {
    '$route' () {
      layoutRender(this, layoutCompile(this), true)
    }
  }
}

module.exports = {
  VueExtendLayout,
  layout,
  version
}
