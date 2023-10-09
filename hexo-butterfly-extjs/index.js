'use strict'

const path = require('path')
const yaml = require('js-yaml')
const { readFileSync, statSync, readdirSync } = require('fs')

hexo.extend.generator.register('pluginsSrc', () => {
  const { third_party_provider } = hexo.theme.config.CDN
  if (third_party_provider && third_party_provider !== 'local') return

  const compareVersions = (version1, version2) => {
    const v1 = version1.split('.').map(Number)
    const v2 = version2.split('.').map(Number)
    
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0
      const num2 = v2[i] || 0
      
      if (num1 < num2) {
        return -1
      } else if (num1 > num2) {
        return 1
      }
    }
    return 0
  }

  const { version } = require((path.join(hexo.theme_dir, 'package.json')))
  const limitVer = '4.8'

  if (compareVersions(version, limitVer) < 0) {
    hexo.log.warn('Please update theme to V4.8.0 or higher')
    hexo.log.warn('Or install hexo-butterfly-extjs to old version')
    hexo.log.warn('npm install hexo-butterfly-extjs@1.3.4')
    process.exit(-1)
  }

  const plugins = yaml.load(readFileSync(path.join(hexo.theme_dir, '/plugins.yml')))
  const dataObj = []
  const errorObj = []

  for (const value of Object.values(plugins)) {
    const fullPath = `${value.name}/${value.file}`
    try {
      dataObj.push({
        path: `pluginsSrc/${fullPath}`,
        data: readFileSync(path.join(hexo.plugin_dir, fullPath))
      })
    } catch (error) {
      errorObj.push(`The file does not exist: ${fullPath}`)
    }
  }

  if (errorObj.length > 0) {
    hexo.log.warn('Please reinstall hexo-butterfly-extjs.')
    for(const value of errorObj) {
      hexo.log.warn(value)
    }
    process.exit(-1)
  }

  // webfonts
  const folders = {}

  folders.fontawesome_free = '@fortawesome/fontawesome-free/webfonts'
  folders.social_share = 'butterfly-extsrc/sharejs/dist/fonts'
  folders.mathjax_font = 'mathjax/es5/output/chtml/fonts'
  folders.katex_font = 'katex/dist/fonts'

  const lookForFiles = (path, origin) => {
    readdirSync(path).forEach(sub => {
      const subPath = `${path}/${sub}`
      const name = `${origin}/${sub}`
      const stat = statSync(subPath)

      if (stat.isDirectory()) {
        lookForFiles(subPath, name)
      } else if (stat.isFile()) {
        dataObj.push({
          path: `pluginsSrc/${name}`,
          data: readFileSync(subPath)
        })
      }
    })
  }

  for (const value of Object.values(folders)) {
    lookForFiles(path.join(hexo.plugin_dir, value), value)
  }

  return dataObj
})