//配置具体的修改规则
const { override, fixBabelImports, addLessLoader, addWebpackAlias, addWebpackExternals, addWebpackPlugin } = require('customize-cra');
const path = require("path")
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')

/**
 * @param target: 要遍历的对象
 * @param name: 插件名
 * @param callback: 回调函数，第一个参数为该插件对象
 * @return null
 */
 function invade(target, name, callback) {
  target.forEach(
    item => {
      if (item.constructor.name === name) {
        callback(item)
      }
    }
  )
}

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
	}),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: { 
      '@primary-color': '#4799ED', //全局主色
      '@component-background': '#fff', //背景颜色
      '@border-radius-base': '4px', // 组件

      // height rules
      "@height-base": "30px",

      // The background colors for active and hover states for things like
      // list items or table cells.
      "@item-active-bg": "#E4EEF8",
      "@item-hover-bg": "#E4EEF8",

      // Layout
      "@layout-body-background": "#fff",
      "@layout-header-height": "70px",
      "@layout-sider-background": "#DCE4EB", //菜单栏背景
      "@layout-trigger-background": "#F5F8FB",
      "@layout-trigger-color": "#409EFF",
      "@layout-header-background": "#EBF1F6",

      //dark theme
      "@menu-dark-bg": "none",
      "@menu-dark-color": "#333",
      "@menu-dark-highlight-color": "#409EFF",
      "@menu-dark-item-active-bg": "#F5F8FB",
      "@menu-dark-selected-item-icon-color": "#409EFF",
      "@menu-dark-selected-item-text-color": "#409EFF",
      "@menu-dark-item-hover-bg": "#409EFF",

      //modal
      "@modal-header-bg": "#409EFF",
      "@modal-header-padding": "13px 24px",
      "@modal-heading-color": "#fff",
      "@modal-close-color": "#fff",
      "@modal-header-close-size": "50px",
      "@modal-body-padding": "30px 73px 20px",
      "@modal-confirm-body-padding": "30px 44px 20px",
      "@modal-footer-border-style": "none",
      "@modal-footer-padding-vertical": "20px",
      "@modal-footer-padding-horizontal": "44px",

      //Form
      "@form-item-margin-bottom": "20px",

      //Table
      "@table-header-bg": "#4799ED",
      "@table-header-color": "#fff",
      "@table-selected-row-bg": "transparent",
      "@table-row-hover-bg": "initial",
      "@table-border-radius-base": 0,
      "@table-selected-row-hover-bg": "initial",

      //tree
      "@tree-directory-selected-bg": "initial",
      "@tree-node-hover-bg": "#E4EEFF",
      "@tree-node-selected-bg": "initial"
    }    
  }),
  addWebpackAlias({
    '@': path.resolve('./src'),
    ["assets"]: path.resolve(__dirname, './src/assets'),
    ["pages"]: path.resolve(__dirname, './src/pages'),
    ["api"]: path.resolve(__dirname, './src/api'),
    ["components"]: path.resolve(__dirname, "src/components"),
    ["store"]: path.resolve(__dirname, './src/store'),
    ["utils"]: path.resolve(__dirname, './src/utils')
  }),
  // externals
  addWebpackExternals({
    // 注意对应的在public/index.html引入jquery的远程文件地址
    "jQuery": "jQuery"
  }),
  (config) => {
    if (process.env.NODE_ENV === "production") {
      config.devtool = false;

      config.output.chunkFilename = config.output.chunkFilename.replace('.chunk', '')

      invade(config.optimization.minimizer, 'TerserPlugin', (e) => {
        e.options.extractComments = false
        e.options.terserOptions.compress.drop_console = true
      })
      invade(config.plugins, 'MiniCssExtractPlugin', (e) => {
        e.options.chunkFilename = e.options.chunkFilename.replace('.chunk', '')
      })

      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial' // only package third parties that are initially dependent
          },
          commons: {
            name: 'chunk-commons',
            test: resolve('src/components'), // can customize your rules
            minChunks: 3, //  minimum common number
            priority: 5,
            reuseExistingChunk: true
          }
        }
      }

      config.plugins.push(
        new ScriptExtHtmlWebpackPlugin(
        {
          // `runtime` must same as runtimeChunk name. default is `runtime`
          inline: /runtime\..*\.js$/
        })
      )

      config.optimization.runtimeChunk = 'single'

    }

    // fs.writeFileSync(`./config-${process.env.NODE_ENV}.json`, JSON.stringify(config))

    return config
  }
);