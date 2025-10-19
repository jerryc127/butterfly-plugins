# hexo-butterfly-category-card-fork

>  [!important]
> 主要是分类目录重复的问题：https://github.com/Akilarlxh/hexo-butterfly-category-card/issues/1 。虽然可以通过 hexo d 正常部署，但由于我使用了 GitHub Actions 进行自动化部署，流程中的 npm install 会重新拉取依赖，从而覆盖我本地对插件源代码的修改，生成网页部署 gh-pages 也不方便了。鉴于原插件作者已长期未更新，我选择复制原版代码并进行适度微调，以便自用和后续维护。
> 
> 我个人的博客 butterfly 主题在功能上的修改，不少也是参考了原插件作者的文章，再次感谢[akilar](https://github.com/Akilarlxh) 


该 repo 为 hexo-butterfly-categories-card 的复制版本，基于原作者的结构进行调整
* 修复了网页中分类目录重复的问题
* 修复了分类卡片描述、封面图不对应的问题
* 剔除了生成子分类卡片
* 参考链接：
    * [akilar - 首页分类卡片](https://akilar.top/posts/a9131002/)
    * [kukual - butterfly主题魔改10：分类页面魔改](https://kukual.github.io/posts/a7bebfb0/index.html)
    * [ll.sc.cn -【butterfly】分类磁贴插件版](https://ll.sc.cn/posts/ab72/)


针对卡片分类随机、描述与封面图不对应被打乱的修复方案

1. 先对分类进行拼音排序
1. 将描述和封面图绑定在一起，视为一个整体
1. 注册分类名`cname`作为可配置项，以分类名作为标识符，绑定描述和封面图


## 使用方法及效果演示

>  [!note]
> **使用该项目需提前引入font-awesome6.5，以及安装 tiny-pinyin**
>
> 主题配置引入见：https://butterfly.js.org/posts/4aa8abbe/?highlight=inject#Inject
> ```
> <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
>```
> 
> 博客根目录：
> ```
> npm install  tiny-pinyin
> ```

【0】已安装原版插件，需先卸载原版

```
npm uninstall hexo-butterfly-categories-card
```

【1】安装插件,在博客根目录下打开终端，运行以下指令：

```
npm install hexo-butterfly-category-card-fork --save
```

【2】在 `_config.butterfly.yml` 添加如下代码，`cname` 填你的分类名。
> 更多相关参数说明，见原版：https://github.com/Akilarlxh/hexo-butterfly-category-card

```yml
# hexo-butterfly-categories-card
# see https://akilar.top/posts/a9131002/
categoryBar:
  enable: true # 开关
  priority: 5 # 过滤器优先权
  enable_page: /categories/ # 应用页面
  layout: # 挂载容器类型
    type: id
    name: page
    index: 0
  column: odd # odd：3列 | even：4列
  row: 9 # 显示行数，默认两行，超过行数切换为滚动显示
  message:
    - cname: Butterfly-雨蝶
      descr: 描述1
      cover: https://wallpapers.com/images/featured-full/blue-butterfly-aesthetic-zzhvssxq8lu8p7g6.jpg
    - cname: 测试
      descr: 描述2
      cover: https://w.wallhaven.cc/full/0q/wallhaven-0qd577.jpg
    - cname: 翻看往事
      descr: 描述3
      cover: https://img1.wallspic.com/previews/9/2/1/1/8/181129/181129-gong_lu_lu_xing-yun_shu-jie-tu_lu-xing_zhi-x750.jpg
    - cname: 考试
      descr: 描述4
      cover:  https://tu.zbhz.org/i/2025/10/17/ufu5xs.jpg
    - cname: 空转记录
      descr: 描述5
      cover: https://www.ntsec.edu.tw/UserFiles/image/Science_study_monthly/2020/59-03/002/6.jpg
    - cname: 图片日记
      descr: 描述6
      cover: https://images.pexels.com/photos/531756/pexels-photo-531756.jpeg 
  custom_css: https://npm.elemecdn.com/hexo-butterfly-categories-card/lib/categorybar.css
```

效果如下

![ ](https://tu.zbhz.org/i/2025/10/18/vfa9ub.jpg)


## 最后

> [!tip]
> 【[【butterfly】分类磁贴插件版- 守正](https://ll.sc.cn/posts/ab72/)】在自定义css文件中，加入以下代码,将原分类显示隐藏：
>
> `#content-inner #page .category-lists {display: none;}`
>
> 由于`.category-lists`被隐藏会导致统计图取不到数值，我的方案是自定义一个js先取值后隐藏。

<details>

<summary>categorybar_categorieschart.js</summary>

```js
document.addEventListener("DOMContentLoaded", function() {
  // 获取元素
  const chart = document.getElementById('tiantianquan-categories');
  const bar = document.getElementById('categoryBar');
  const categoryLists = document.querySelector('.category-lists');

  // 1️⃣ 移动 chart 到 categoryBar 上方
  if (chart && bar && bar.parentNode) {
    bar.parentNode.insertBefore(chart, bar);
  }

  // 2️⃣ 隐藏整个 category-lists 容器
  if (categoryLists) {
    categoryLists.style.display = 'none';
  }
});
```
</details>


