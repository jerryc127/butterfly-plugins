'use strict'

const path = require('path')
const yaml = require('js-yaml')
const { readFileSync, statSync, readdirSync } = require('fs')

hexo.extend.generator.register('pluginsSrc', () => {
  const { third_party_provider } = hexo.theme.config.CDN
  if (third_party_provider && third_party_provider !== 'local') return

  const plugins = yaml.load(readFileSync(path.join(__dirname, '/plugins.yml')))
  const dataObj = []
  const errorObj = []

  for (const value of Object.values(plugins)) {
    try {
      dataObj.push({
        path: `pluginsSrc/${value}`,
        data: readFileSync(path.join(hexo.plugin_dir, value))
      })
    } catch (error) {
      errorObj.push(`The file does not exist: ${value}`)
    }
  }

  if (errorObj.length > 0) {
    hexo.log.warn('Please reinstall hexo-butterfly-extjs, run npm install hexo-butterfly-extjs.')
    for(const value of errorObj) {
      hexo.log.warn(value)
    }
    process.exit(-1)
  }

  // webfonts
  const folders = []

  folders.fontawesome_free = '@fortawesome/fontawesome-free/webfonts'
  folders.social_share = 'social-share.js/dist/fonts'

  const lookForFiles = (path, origin) => {
    readdirSync(path).forEach(sub => {
      const subPath = path + '/' + sub
      const name = origin + '/' + sub
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