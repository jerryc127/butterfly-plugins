'use strict'

const request = require('urllib-sync').request
const ejs = require('ejs')
const xpath = require('xpath')
const path = require('path')
const { DOMParser } = require('@xmldom/xmldom')
const renderStar = require('./util').renderStar
const i18n = require('./util').i18n
let offline = false

const log = require('hexo-log')({
  debug: false,
  silent: false
})

function resolv (url, timeout) {
  let response = ''
  try {
    response = request(url, {
      timeout: timeout,
      dataType: 'xml'
    })
  } catch (err) {
    offline = true
  }

  if (offline) {
    return {
      list: [],
      next: ''
    }
  }

  const doc = new DOMParser({
    errorHandler: {
      warning: function (e) {
      },

      error: function (e) {
      },

      fatalError: function (e) {
      }
    }
  }).parseFromString(response.data.toString())

  const items = xpath.select('//div[@class="grid-view"]/div[@class="item"]', doc)
  let next = xpath.select('string(//span[@class="next"]/a/@href)', doc)
  if (next.startsWith('/')) {
    next = 'https://movie.douban.com' + next
  }

  const list = []
  for (const i in items) {
    const parser = new DOMParser().parseFromString(items[i].toString())
    const title = xpath.select1('string(//li[@class="title"]/a/em)', parser)
    const alt = xpath.select1('string(//li[@class="title"]/a/@href)', parser)
    const image = xpath.select1('string(//div[@class="item"]/div[@class="pic"]/a/img/@src)', parser).replace('ipst', 'spst')

    let tags = xpath.select1('string(//li/span[@class="tags"])', parser)
    tags = tags ? tags.substr(3) : ''
    let date = xpath.select1('string(//li/span[@class="date"])', parser)
    date = date || ''

    let recommend = xpath.select1('string(//li/span[starts-with(@class,"rating")]/@class)', parser)
    recommend = renderStar(recommend.substr(6, 1))
    let comment = xpath.select1('string(//li/span[@class="comment"])', parser)
    comment = comment || ''

    let info = xpath.select1('string(//li[@class="intro"])', parser)
    info = info || ''

    // image = 'https://images.weserv.nl/?url=' + image.substr(8, image.length - 8) + '&w=100';

    list.push({
      title: title,
      alt: alt,
      image: image,
      tags: tags,
      date: date,
      recommend: recommend,
      comment: comment,
      info: info
    })
  }

  return {
    list: list,
    next: next
  }
}

module.exports = function (locals) {
  const config = this.config
  if (!config.douban || !config.douban.movie) { // 当没有输入movie信息时，不进行数据渲染。
    return
  }

  let root = config.root
  if (root.endsWith('/')) {
    root = root.slice(0, root.length - 1)
  }

  let timeout = 10000
  if (config.douban.timeout) {
    timeout = config.douban.timeout
  }

  const startTime = new Date().getTime()
  let wish = []
  let watched = []
  let watching = []
  const limitPage = config.douban.movie.limit || false

  const wishUrl = 'https://movie.douban.com/people/' + config.douban.user + '/wish'

  for (let nextWish = wishUrl, limit = 1; nextWish;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resWish = resolv(nextWish, timeout)
    nextWish = resWish.next
    wish = wish.concat(resWish.list)
  }

  const watchedUrl = 'https://movie.douban.com/people/' + config.douban.user + '/collect'

  for (let nextWatched = watchedUrl, limit = 1; nextWatched;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resWatched = resolv(nextWatched, timeout)
    nextWatched = resWatched.next
    watched = watched.concat(resWatched.list)
  }

  const watchingUrl = 'https://movie.douban.com/people/' + config.douban.user + '/do'

  for (let nextWatching = watchingUrl, limit = 1; nextWatching;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resWatching = resolv(nextWatching, timeout)
    nextWatching = resWatching.next
    watching = watching.concat(resWatching.list)
  }

  const endTime = new Date().getTime()

  const offlinePrompt = offline ? ', because you are offline or your network is bad' : ''

  log.info(wish.length + watched.length + ' movies have been loaded in ' + (endTime - startTime) + ' ms' + offlinePrompt)

  const __ = i18n.__(config.language)

  const lazyloadConfig = this.theme.config.lazyload
  const themeLazyload = lazyloadConfig.enable ? (!!(lazyloadConfig.field && lazyloadConfig.field === 'site')) : false

  let contents
  ejs.renderFile(path.join(__dirname, 'templates/movie.ejs'), {
    meta: config.douban.movie.meta,
    quote: config.douban.movie.quote,
    wish: wish,
    watched: watched,
    watching: watching,
    __: __,
    root: root,
    lazyload: themeLazyload
  }, {},
  function (err, result) {
    if (err) console.log(err)
    contents = result
  })

  const pathName = config.douban.movie.path || 'movies'

  return {
    path: `${pathName}/index.html`,
    data: {
      title: config.douban.movie.title,
      content: contents,
      slug: 'movies',
      comments: config.douban.movie.comments,
      top_img: config.douban.movie.top_img,
      aside: config.douban.movie.aside
    },
    layout: ['page', 'post']
  }
}
