'use strict'
// 全局声明插件代号
const pluginname = 'butterfly_category_card_fork'
// 全局声明依赖
const pug = require('pug')
const path = require('path')
const urlFor = require('hexo-util').url_for.bind(hexo)
const util = require('hexo-util')
const pinyin = require('tiny-pinyin'); // 引入 tiny-pinyin 库

hexo.extend.filter.register('after_generate', function () {

  // =====================================================================
  // 首先获取整体的配置项名称
  const config = hexo.config.categoryBar || hexo.theme.config.categoryBar
  // 如果配置开启
  if (!(config && config.enable)) return
    // 获取所有分类
    var categories_list = hexo.locals.get('categories').data;
    var categories_message = config.message;  // message 配置中包含 cname, descr 和 cover
    //声明一个空数组用来存放合并后的对象
    var new_categories_list = [];

    // console.log("当前分类列表:", categories_list);
    // console.log("配置信息:", categories_message);

    // 只保留一级分类（父分类为空）
    var top_level_categories = categories_list.filter(category => !category.parent);

    // console.log("一级分类列表:", top_level_categories);

    // 合并一级分类的属性和新添加的封面描述属性
    for (var i = 0; i < top_level_categories.length; i++) {
      var a = top_level_categories[i];
      var b = categories_message.find(msg => msg.cname === a.name); // 使用分类名称 cname 来查找对应的 descr 和 cover
      if (b) {
        // console.log(`找到匹配分类: ${a.name}, 描述: ${b.descr}, 封面: ${b.cover}`);
        new_categories_list.push(Object.assign({}, a, { path: a.path }, b));
      } else {
        // 如果没有找到对应的 descr 和 cover，可以给它们赋默认值
        // console.log(`没有找到匹配描述和封面，使用默认值: ${a.name}`);
        new_categories_list.push(Object.assign({}, a, { path: a.path, descr: '', cover: '' }));
      }
    }

    // console.log("合并后的分类列表:", new_categories_list);

    // 通过分类名称的拼音进行排序
    new_categories_list.sort(function(a, b) {
      // 获取分类的拼音并转换为字符串进行比较
      const a_pinyin = pinyin.convertToPinyin(a.name).replace(/[^a-zA-Z0-9]/g, ''); // 清理拼音中的非字母数字字符
      const b_pinyin = pinyin.convertToPinyin(b.name).replace(/[^a-zA-Z0-9]/g, ''); // 同上
      // console.log(`拼音比较: ${a.name} -> ${a_pinyin}, ${b.name} -> ${b_pinyin}`);
      return a_pinyin.localeCompare(b_pinyin); // 根据拼音排序
    });

    // console.log("排序后的分类列表:", new_categories_list);

  // 集体声明配置项
  const data = {
    pjaxenable: hexo.theme.config.pjax.enable,
    enable_page: config.enable_page ? config.enable_page : "/",
    layout_type: config.layout.type,
    layout_name: config.layout.name,
    layout_index: config.layout.index ? config.layout.index : 0,
    categories_list: new_categories_list,
    column: config.column ? config.column : 'odd', // odd：3列 | even：4列
    row: config.row ? config.row : 2, //显示行数，默认两行，超过行数切换为滚动显示
    custom_css: config.custom_css ? urlFor(config.custom_css) : "https://cdn.jsdelivr.net/npm/hexo-butterfly-categories-card/lib/categorybar.css"
  }

  // 渲染页面
  const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'), data);

  // cdn资源声明
  const css_text = `<link rel="stylesheet" href="${data.custom_css}">`
  var get_layout
  if (data.layout_type === 'class') {
    get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`
  }
  else if (data.layout_type === 'id') {
    get_layout = `document.getElementById('${data.layout_name}')`
  }
  else {
    get_layout = `document.getElementById('${data.layout_name}')`
  }

  // 挂载容器脚本
  var user_info_js = `<script data-pjax>
  function ${pluginname}_injector_config(){
    var parent_div_git = ${get_layout};
    if (!parent_div_git) {
      console.warn('${pluginname}: 挂载容器不存在，正在动态创建...');
      parent_div_git = document.createElement('div');
      parent_div_git.id = '${data.layout_name}';
      document.querySelector('#page').prepend(parent_div_git);
    }
    var item_html = '${temple_html_text}';
    console.log('已挂载 ${pluginname}');
    parent_div_git.insertAdjacentHTML("afterbegin",item_html)
  }
  if (location.pathname.startsWith('${data.enable_page}') || '${data.enable_page}' === 'all') {
    ${pluginname}_injector_config();
  }
  </script>`

  // 注入用户脚本
  hexo.extend.injector.register('body_end', user_info_js, "default");
  hexo.extend.injector.register('head_end', css_text, "default");
})

hexo.extend.helper.register('priority', function(){
  const pre_priority = hexo.config.categoryBar.priority || hexo.theme.config.categoryBar.priority
  const priority = pre_priority ? pre_priority : 10
  return priority
})
