'use strict'

const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)

hexo.extend.generator.register('artitalk', function (locals) {
  const config = hexo.config.artitalk || hexo.theme.config.artitalk

  if (!(config && config.enable)) return

  const data = {
    appId: config.appId,
    appKey: config.appKey,
    option: config.option ? JSON.stringify(config.option) : false,
    js: config.js ? urlFor(config.js) : 'https://cdn.jsdelivr.net/npm/artitalk'
  }

  const content = pug.renderFile(path.join(__dirname, './lib/html.pug'), data)

  const pathPre = config.path || 'artitalk'

  let pageDate = {
    content: content
  }

  if (config.front_matter) {
    pageDate = Object.assign(pageDate, config.front_matter)
  }

  return {
    path: pathPre + '/index.html',
    data: pageDate,
    layout: ['page', 'post']
  }
})
