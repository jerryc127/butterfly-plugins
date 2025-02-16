'use strict'

const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)

hexo.extend.generator.register('hpptalk', function (locals) {
  const config = hexo.config.hpptalk || hexo.theme.config.hpptalk

  if (!(config && config.enable)) return

  const data = {
    domain: config.domain,
    limit: config.limit || 8,
    start: config.start || 0,
    js: config.js ? urlFor(config.js) : 'https://cdn.jsdelivr.net/gh/HexoPlusPlus/HexoPlusPlus@latest/talk_user.js',
    css: config.css ? urlFor(config.css) : 'https://cdn.jsdelivr.net/gh/HexoPlusPlus/HexoPlusPlus@latest/talk.css',
    option: config.option ? JSON.stringify(config.option) : false
  }

  const content = pug.renderFile(path.join(__dirname, './lib/html.pug'), data)

  const pathPre = config.path || 'hpptalk'

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
