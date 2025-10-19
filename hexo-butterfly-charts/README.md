<!-- This file is modified by guole.fun -->
# Butterfly 统计图表
> Modified from [hexo-charts](https://www.npmjs.com/package/hexo-charts)  
> Modified from [hexo-statistics-charts](https://www.npmjs.com/package/hexo-statistics-charts)  

## [Demo页面](https://blog.guole.fun/charts/)

## 修改说明
* 页面文案调整回中文
* 删除类别统计图表的标题

## 描述
将 hexo poats、类别和标签的统计数据呈现到图表中。
> 灵感来自 HEXO 主题 [matery](https://github.com/blinkfox/hexo-theme-matery).

* 包含
  * 发布统计
  * 发布日历
  * 标签统计
  * 分类统计
  * 分类雷达图  

* 更新日志
<details>
<summary>点击展开 v1.1.6</summary>
  * 字体、标题与图表区域间隔等视觉样式微调； <br>
  * 文章发布日历，绘图区域未居中修正； <br>
</details>
<details>
<summary>点击展开 v1.1.5</summary>
  * 插件默认 `echarts_CDN` 修改为：`https://lib.baomitu.com/echarts/4.7.0/echarts.min.js` <br>
  * 新增配置项：`echarts_CDN` 解决原来使用的固定 CDN 资源失效问题。使用方法： <br>
```yml
# 统计图表，支持发布文章统计、发布日历、Top标签统计、分类统计、分类雷达。 <br>
# see https://www.npmjs.com/package/hexo-butterfly-charts  <br>
charts: <br>
  enable: true # 是否启用功能 <br>
  postsChart: <br>
    title: 文章发布统计 # 设置文章发布统计的标题，默认为空 <br>
    interval: 1 # 横坐标间隔 <br>
  tagsChart: <br>
    title: Top 10 标签统计 # 设置标签统计的标题，默认为空 <br>
    interval: 1 # 横坐标间隔 <br>
  postsCalendar_title: 文章发布日历 # 设置发布日历的标题，默认为空 <br>
  categoriesChart_title: # 设置分类统计的标题，默认为空 <br>
  categoriesRadar_title: # 设置分类雷达的标题，默认为空 <br>
+ echarts_CDN: # https://lib.baomitu.com/echarts/4.7.0/echarts.min.js <br>
```
</details>
<details>
<summary>点击展开 v1.1.4</summary>
  * 更新 moment 到 2.29.4 <br>
</details>
<details>
<summary>点击展开 v1.1.2</summary>
  * 调整分类统计图中，“# 文章分类”为 “✒️文章篇数” <br>
</details>
<details>
<summary>点击展开 v1.1.1</summary>
  * 增加标签的横纵坐标轴名称 <br>
  * 适配butterfly暗色模式，自动切换 <br>
  * 文章发布日历坐标也换成中文 <br>
  * 各图表标题支持配置 <br>
  * 标签/分类统计图支持配置横坐标显示的间隔数 <br>
  * 解决分类雷达图未设置画布高度的bug <br>
  Bug: <br>
    * 解决雷达图上，鼠标hover时，超出内容被画布吞掉的问题  
</details>
---

## 示例 [Demo](https://blog.guole.fun/charts/)

* 发布日历
  
![发布日历](https://blog.guole.fun/posts/18158/发布日历3.jpg)

* 发布统计
  
![发布统计](https://blog.guole.fun/posts/18158/发布统计3.jpg)

* 标签统计
  
![标签统计](https://blog.guole.fun/posts/18158/标签3.jpg)

* 分类统计（无标题）/分类雷达图（无标题）
  
![分类统计](https://blog.guole.fun/posts/18158/分类统计3.jpg)

* 分类雷达图（无标题）
  
![分类雷达](https://blog.guole.fun/posts/18158/分类雷达3.jpg)

<details>
<summary>点击查看暗色模式截图</summary>

* 发布日历
  
![发布日历](https://blog.guole.fun/posts/18158/发布日历4.jpg)

* 发布统计
  
![发布统计](https://blog.guole.fun/posts/18158/发布统计4.jpg)

* 标签统计
  
![标签统计](https://blog.guole.fun/posts/18158/标签4.jpg)

* 分类统计（无标题）/分类雷达图（无标题）
  
![分类统计](https://blog.guole.fun/posts/18158/分类统计4.jpg)

* 分类雷达图（无标题）
  
![分类雷达](https://blog.guole.fun/posts/18158/分类雷达4.jpg)

</details>
---

## 安装

```shell
npm install hexo-butterfly-charts --save
```

## 用法

[点击查看使用方法](https://blog.guole.fun/posts/18158/)

## 许可
[Apache License 2.0](https://github.com/kuole-o/hexo-butterfly-charts/blob/main/LICENSE)
