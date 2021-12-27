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

function resolv (url, timeout, headers) {
  let response = ''
  try {
    response = request(url, {
      timeout: timeout,
      dataType: 'xml',
      headers: headers
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

  if (headers.Cookie instanceof Array && headers.Cookie.length === 0) {
    headers.Cookie = response.headers['set-cookie']
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

  const items = xpath.select('//ul[@class="interest-list"]/li[@class="subject-item"]', doc)

  let next = xpath.select('string(//span[@class="next"]/a/@href)', doc)
  if (next.startsWith('/')) {
    next = 'https://book.douban.com' + next
  }

  const list = []
  for (const i in items) {
    const parser = new DOMParser().parseFromString(items[i].toString())
    const title = xpath.select1('string(//div[@class="info"]/h2/a/@title)', parser)
    const alt = xpath.select1('string(//div[@class="info"]/h2/a/@href)', parser)
    const image = xpath.select1('string(//div[@class="pic"]/a/img/@src)', parser)

    const pub = xpath.select1('string(//div[@class="pub"])', parser)

    const updated = xpath.select1('string(//span[@class="date"])', parser)

    let tags = xpath.select1('string(//span[@class="tags"])', parser)
    tags = tags ? tags.substr(3) : ''

    let recommend = xpath.select1('string(//div[@class="short-note"]/div/span[contains(@class,"rating")]/@class)', parser)
    recommend = renderStar(recommend.substr(6, 1))
    let comment = xpath.select1('string(//p[@class="comment"])', parser)
    comment = comment || ''

    // image = 'https://images.weserv.nl/?url=' + image.substr(8, image.length - 8) + '&w=100';

    list.push({
      title: title,
      alt: alt,
      image: image,
      pub: pub,
      updated: updated,
      tags: tags,
      recommend: recommend,
      comment: comment
    })
  }

  return {
    list: list,
    next: next
  }
}

module.exports = function (locals) {
  const config = this.config
  if (!config.douban || !config.douban.book) { // 当没有输入book信息时，不进行数据渲染。
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
  let read = []
  let reading = []
  const headers = {
    Cookie: []
  }
  const limitPage = config.douban.book.limit || false

  const wishUrl = 'https://book.douban.com/people/' + config.douban.user + '/wish'

  for (let nextWish = wishUrl, limit = 1; nextWish;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resWish = resolv(nextWish, timeout, headers)
    nextWish = resWish.next
    wish = wish.concat(resWish.list)
  }

  const readingUrl = 'https://book.douban.com/people/' + config.douban.user + '/do'

  for (let nextreading = readingUrl, limit = 1; nextreading;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resreading = resolv(nextreading, timeout, headers)
    nextreading = resreading.next
    reading = reading.concat(resreading.list)
  }

  const readUrl = 'https://book.douban.com/people/' + config.douban.user + '/collect'

  for (let nextread = readUrl, limit = 1; nextread;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resread = resolv(nextread, timeout, headers)
    nextread = resread.next
    read = read.concat(resread.list)
  }

  const endTime = new Date().getTime()

  const offlinePrompt = offline ? ', because you are offline or your network is bad' : ''

  log.info(wish.length + read.length + ' books have been loaded in ' + (endTime - startTime) + ' ms' + offlinePrompt)

  const __ = i18n.__(config.language)

  const lazyloadConfig = this.theme.config.lazyload
  const themeLazyload = lazyloadConfig.enable ? (!!(lazyloadConfig.field && lazyloadConfig.field === 'site')) : false

  let contents

  ejs.renderFile(path.join(__dirname, 'templates/book.ejs'), {
    meta: config.douban.book.meta,
    quote: config.douban.book.quote,
    wish: wish,
    read: read,
    reading: reading,
    __: __,
    root: root,
    lazyload: themeLazyload
  },
  function (err, result) {
    if (err) console.log(err)
    contents = result
  })

  const pathName = config.douban.book.path || 'books'

  return {
    path: `${pathName}/index.html`,
    data: {
      title: config.douban.book.title,
      content: contents,
      slug: 'books',
      comments: config.douban.book.comments,
      top_img: config.douban.book.top_img,
      aside: config.douban.book.aside
    },
    layout: ['page', 'post']
  }
}
