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

  const items = xpath.select('//div[@class="game-list"]/div[@class="common-item"]', doc)
  const list = []
  let next = xpath.select('string(//span[@class="next"]/a/@href)', doc)
  if (next.startsWith('?')) {
    next = url.substring(0, url.lastIndexOf('?')) + next
  }
  for (const i in items) {
    const parser = new DOMParser().parseFromString(items[i].toString())
    const title = xpath.select1('string(//div[@class="title"]/a)', parser)
    const alt = xpath.select1('string(//div[@class="title"]/a/@href)', parser)
    const image = xpath.select1('string(//div[@class="pic"]/a/img/@src)', parser)

    let tags = xpath.select1('string(//div[@class="rating-info"]/span[@class="tags"])', parser)
    tags = tags ? tags.substr(3) : ''
    let date = xpath.select1('string(//div[@class="rating-info"]/span[@class="date"])', parser)
    date = date || ''

    let recommend = xpath.select1('string(//div[@class="rating-info"]/span[contains(@class,"allstar")]/@class)', parser)

    recommend = renderStar(recommend.substr(19, 1))

    let comment = xpath.select1('string(//div[@class="content"]/div[not(@class)])', parser)
    comment = comment || ''

    let info = xpath.select1('string(//div[@class="desc"]/text())', parser)
    info = info || ''
    info = info.replace(/(^\s*)|(\s*$)/g, '')

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
  const startTime = new Date().getTime()

  const config = this.config

  if (!config.douban || !config.douban.game) { // 当没有输入game信息时，不进行数据渲染。
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

  const rawUrl = 'https://www.douban.com/people/' + config.douban.user + '/games'
  const playedUrl = rawUrl + '?action=collect'
  const playingUrl = rawUrl + '?action=do'
  const wishUrl = rawUrl + '?action=wish'

  let wish = []
  let played = []
  let playing = []
  const limitPage = config.douban.game.limit || false

  for (let nextWish = wishUrl, limit = 1; nextWish;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resWish = resolv(nextWish, timeout)
    nextWish = resWish.next
    wish = wish.concat(resWish.list)
  }

  for (let nextPlayed = playedUrl, limit = 1; nextPlayed;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resPlayed = resolv(nextPlayed, timeout)
    nextPlayed = resPlayed.next
    played = played.concat(resPlayed.list)
  }

  for (let nextPlaying = playingUrl, limit = 1; nextPlaying;) {
    if (limitPage && limit > limitPage) break
    limit++
    const resPlaying = resolv(nextPlaying, timeout)
    nextPlaying = resPlaying.next
    playing = playing.concat(resPlaying.list)
  }

  const endTime = new Date().getTime()

  const offlinePrompt = offline ? ', because you are offline or your network is bad' : ''

  log.info(wish.length + played.length + playing.length + ' games have been loaded in ' + (endTime - startTime) + ' ms' + offlinePrompt)

  const __ = i18n.__(config.language)

  const lazyloadConfig = this.theme.config.lazyload
  const themeLazyload = lazyloadConfig.enable ? (!!(lazyloadConfig.field && lazyloadConfig.field === 'site')) : false

  let contents

  ejs.renderFile(path.join(__dirname, 'templates/game.ejs'), {
    meta: config.douban.game.meta,
    quote: config.douban.game.quote,
    wish: wish,
    played: played,
    playing: playing,
    __: __,
    root: root,
    lazyload: themeLazyload
  }, function (err, result) {
    if (err) console.log(err)
    contents = result
  })

  const pathName = config.douban.game.path || 'games'

  return {
    path: `${pathName}/index.html`,
    data: {
      title: config.douban.game.title,
      content: contents,
      slug: 'games',
      comments: config.douban.game.comments,
      top_img: config.douban.game.top_img,
      aside: config.douban.game.aside
    },
    layout: ['page', 'post']
  }
}
