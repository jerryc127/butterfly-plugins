'use strict'

const path = require('path')
const yaml = require('js-yaml')
const { readFileSync, statSync, readdirSync } = require('fs')

hexo.extend.generator.register('pluginsSrc', () => {
  const { third_party_provider } = hexo.theme.config.CDN || {}
  if (third_party_provider && third_party_provider !== 'local') return

  hexo.log.info(
    '[hexo-butterfly-extjs] 提醒：主題更新時，hexo-butterfly-extjs 也會跟著更新。' +
    '如果遇到插件問題，請升級主題到最新版或者把插件降級。'
  )

  hexo.log.info(
    '[hexo-butterfly-extjs] Notice: When the theme updates, hexo-butterfly-extjs will also be updated. ' +
    'If you encounter plugin issues, please upgrade the theme to the latest version or downgrade the plugin.'
  )

  const plugins = yaml.load(
    readFileSync(path.join(hexo.theme_dir, 'plugins.yml'))
  )

  const dataObj = []
  const errorObj = []
  const fileCache = new Map()

  const getModulePath = moduleName => {
    try {
      const packagePath = require.resolve(moduleName)
      const match = packagePath.match(/(.*[\\/]node_modules)(?=[\\/])/)
      return match ? match[0] : hexo.plugin_dir
    } catch {
      return hexo.plugin_dir
    }
  }

  const readFileCached = absPath => {
    if (!fileCache.has(absPath)) {
      fileCache.set(absPath, readFileSync(absPath))
    }
    return fileCache.get(absPath)
  }

  const pushFile = (targetPath, absPath) => {
    dataObj.push({
      path: `pluginsSrc/${targetPath}`,
      data: readFileCached(absPath)
    })
  }

  Object.values(plugins).forEach(value => {
    const relPath = `${value.name}/${value.file}`
    const absPath = path.join(getModulePath(value.name), relPath)
    try {
      pushFile(relPath, absPath)
    } catch {
      errorObj.push(`Missing file: ${relPath}`)
    }
  })

  if (errorObj.length) {
    hexo.log.warn('Please reinstall hexo-butterfly-extjs:')
    errorObj.forEach(msg => hexo.log.warn(msg))
    process.exit(-1)
  }

  // webfonts
  const folders = {
    fontawesome_free: {
      name: '@fortawesome/fontawesome-free',
      path: 'webfonts'
    },
    social_share: {
      name: 'butterfly-extsrc',
      path: 'sharejs/dist/fonts'
    },
    mathjax: {
      name: 'mathjax',
      path: '.',
      enable: hexo.theme.config.math.use === 'mathjax'
    },
    mathjax_font: {
      name: '@mathjax/mathjax-newcm-font',
      path: '.',
      enable: hexo.theme.config.math.use === 'mathjax'
    },
    mathjax_bbm_font: {
      name: '@mathjax/mathjax-mhchem-font-extension',
      path: '.',
      enable: hexo.theme.config.math.use === 'mathjax'
    },
    katex_font: {
      name: 'katex',
      path: 'dist/fonts',
      enable: hexo.theme.config.math.use === 'katex'
    }
  }

  const lookForFiles = (dirPath, origin) => {
    readdirSync(dirPath).forEach(sub => {
      const subPath = path.join(dirPath, sub)
      const name = `${origin}/${sub}`
      const stat = statSync(subPath)

      if (stat.isDirectory()) {
        lookForFiles(subPath, name)
      } else if (stat.isFile()) {
        pushFile(name, subPath)
      }
    })
  }

  Object.values(folders)
    .filter(f => f.enable !== false)
    .forEach(f => {
      const basePath = path.join(getModulePath(f.name), f.name, f.path)
      lookForFiles(basePath, path.join(f.name, f.path))
    })

  return dataObj
})
