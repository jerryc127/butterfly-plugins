## hexo-butterfly-artitalk

給 hexo-theme-butterfly 添加 [Artitalk](https://artitalk.js.org/) 説説

### 安裝

1. 安裝插件
    ```bash
    npm install hexo-butterfly-artitalk
    ```

2. LeanCloud 配置
    參考 [Artitalk 文檔 - LeanCloud 的相關準備](https://artitalk.js.org/doc.html#%F0%9F%8C%88-leancloud-%E7%9A%84%E7%9B%B8%E5%85%B3%E5%87%86%E5%A4%87)

3. 添加配置信息
    在 **Hexo** 的配置文件 或者 **主題**的配置文件中添加

    ```yaml
      # Artitalk
      # see https://artitalk.js.org/
      artitalk:
        enable: true
        appId:
        appKey:
        path:
        js:
        option:
        front_matter:
    ```

    | 參數         | 解釋                                                         |
    | ------------ | ------------------------------------------------------------ |
    | appId        | 【必須】LeanCloud 創建的應用中的 AppID                       |
    | appKey       | 【必須】LeanCloud 創建的應用中的 AppKEY                      |
    | path         | 【可選】Artitalk 的路徑名稱（默認為 `artitalk`，生成的頁面為 artitalk/index.html） |
    | js           | 【可選】更換 Artitalk 的 js CDN（默認為 `https://cdn.jsdelivr.net/npm/artitalk`） |
    | option       | 【可選】Artitalk 需要的額外配置                              |
    | front_matter | 【可選】Artitalk 頁面的 front_matter 配置                    |


### 截圖

![image](https://user-images.githubusercontent.com/16351105/107762957-c4c1e580-6d68-11eb-984f-74c9bf6325e9.png)