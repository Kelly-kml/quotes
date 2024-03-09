---
title: webpack原理以及进阶
date: 2024-01-30 22:08:23
categories:
  - Webpack源码
tags:
  - Webpack
---

**本文的项目链接： https://github.com/Kelly-kml/kelly-webpack-test**

本文我们通过自己搭建一个测试 `demo` 来实现对 `webpack` 一些基本配置以及进阶优化功能的练手以及测试,建议读者跟着文章自己手操作一遍，并且要保持版本的一致。

## 1. 初始化项目：

使用 `npm init -y` 进行初始化

要使用 webpack，那么就得安装 webpack、webpacl-cli

```json
npm install webpack webpack-cli -D
```

本文使用的版本号为：

```json
├── webpack@5.89.0
└── webpack-cli@5.1.4
└── node@v18.16.0
```

从 webpack V4.0 开始，webpack 就是开箱机用的，因此，接下来我们可以直接利用一个入口文件来尝试一下。

新建 src/index.js 文件：

```js
const getString = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello world');
    }, 2000);
  });
};

const helloWorld = async () => {
  const str = await getString();
  console.log(str);
};

export default helloWorld;
```

使用 `npx webpack --mode=development` 进行构建，默认是 `production` 模式，我们为了更清楚得查看打包后的代码，使用 `development` 模式。

构建完成之后，会在项目下产生一个 `disk` 目录，里面有一个打包文件：main.js

查看 `main.js` 文件，可以看到：`index.js` 并没有被转义为低版本的代码

```js
/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = {
    /***/ './src/index.js':
      /*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
      /***/ () => {
        eval(
          "/*\r\n * @Description: \r\n * @author: kelly\r\n * @Date: 2024-01-18 23:38:32\r\n * @LastEditTime: 2024-01-19 10:13:51\r\n */\r\n//index.js\r\nclass Person {\r\n  constructor(name) {\r\n    this.name = name;\r\n  }\r\n  getName () {\r\n    return this.name;\r\n  }\r\n}\r\n\r\nconst student = new Person('kelly');\r\n\r\n\n\n//# sourceURL=webpack://webpack_basic/./src/index.js?"
        );

        /***/
      },

    /******/
  };
  /******/ var __webpack_exports__ = {};
  /******/ __webpack_modules__['./src/index.js']();
  /******/
  /******/
})();
```

## 2. 将 JS 转义为低版本

这时，我们前面讲的 webpack 的核心 `loader` 就得派上场啦

我们可以利用 `babel-loader` 来实现将 JS 转义为低版本。

首先我先安装 `babel-loader`

- `babel-loader` 在 webpack 用来解析 ES6

```js
npm install babel-loader -D
```

此外，我们还需要配置 babel 的依赖包：

- `@babel/core` babel 核心模块
- `@babel/preset-env` babel 预设 一组 babel 插件的集合

```js
npm i @babel/core @babel/preset-env -D
```

接下来在 `webpack.config.js` 配置 rules:

```js
module: {
  //设置模块
  rules: [
    //设置loader
    {
      test: /\.js$/, //已作为js扩展名这样类型的文件
      exclude: /node_modules/, //排除node_modules文件夹
      use: {
        loader: 'babel-loader', //转换成es5
        options: {
          presets: ['@babel/preset-env'], //设置编译的规则
        },
      },
    },
  ];
}
```

但是这样子直接打包会失败，因为目前解析不了 ES6 中的 async/ await 语法。

我们需要给安装插件 `regeneratorRuntime`

- `regeneratorRuntime` 是 webpack 打包生成的全局辅助函数
- 由 babel 生成 用于兼容 `async/await` 的语法

```js
npm i @babel/runtime -D // 包含了regeneratorRuntime运行时候需要的内容
npm i @babel/plugin-transform-runtime // 这个插件在需要regeneratorRuntime的地方自动导入包 就是在需要的时候会自动运行他
```

响应地，在 babel 中 的 rules 也新增 plugin 的配置：

```js
 {
    test:/\.js$/, //已作为js扩展名这样类型的文件
    exclude:/node_modules/, //排除node_modules文件夹
    use:{
      loader:'babel-loader', //转换成es5
      options:{
        presets:['@babel/preset-env'], //设置编译的规则
        plugins:[ // 设置编译的插件
          ['@babel/plugin-transform-runtime'] //设置编译的规则
        ]
      }
    }
  }
```

## 3. 构建打包

此时，运行 `npx webpack ` 构建就可以成功完成打包了。

![19a05ae4124d4691027172239364d88.png](https://s2.loli.net/2024/02/01/kft523UESrOncMZ.png)

紧接着，可以在 dist/bundle.js 可以看到：src/index.js 中的代码成功地转为 ES5。

![c701a0a0d10ad03b69ea77eeafd3c8b.png](https://s2.loli.net/2024/02/01/aJrnz9UPlxehcg3.png)

项目进行到目前为止，我们就搭建好了 webpack 基本的构建打包配置了。

接下来，我们就可以根据项目开发中的情况来进行某些特定场景的配置啦 ！

## 4.管理输出：

### （1）多入口设置：

我们知道 webpack 可以利用 `entry` 设置多入口起点，那么具体是怎么设置的呢？

- 先在 src 文件夹下新建一个新的文件 `print.js`

```js
export default function printMe() {
  console.log('I get called from print.js!');
}
```

- 并在 `src/index.js` 文件中使用这个函数：

```js
import printMe from './print';

const getString = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello world');
    }, 2000);
  });
};

const helloWorld = async () => {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;
  element.appendChild(btn);

  const str = await getString();
  console.log(str);

  return element;
};

export default helloWorld;
```

- 更新 `dist/index.html` 文件，为 webpack 分离入口文件做好准备：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>资源管理</title>
    <script src="./print.bundle.js"></script>
  </head>
  <body>
    <script src="./index.bundle.js"></script>
  </body>
</html>
```

- 调整 `entry` 配置：在 entry 添加 `src/print.js` 作为新的入口起点（命名为 `print`），然后修改 output 使得能够根据入口起点定义的名称动态生成 bundle 名称。

```js
module.exports = {
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
```

- 重新构建，会看到在 `dist` 文件夹下生成两个新的 bundle.js 文件。

### （2）`HtmlWebpackPlugin`

不过这也产生了新的问题，如果我们更改起点的名称，在构建时就会出现新的 bundle，而 index.html 仍然在引用旧的名称，这导致了 dist 文件夹下生成非常多 bundle，乍一看就很乱。

后来，我们可以使用 `HtmlWebpackPlugin` 插件解决这个问题。

`HtmlWebpackPlugin` 可以简化 HTML 文件的创建，每次 webpack 进行构建可以整合全部的 bundle 文件存于 index.html，每个 bundle 用 Hash 值形成一个映射关系，而且每次构建生成的 index.html 会替换旧 index.html。

_插件细节可以查看相关[源码](https://github.com/jantimon/html-webpack-plugin)。_

```js
npm install --save-dev html-webpack-plugin
```

重新构建后，会发现：**代码编辑器中打开 `index.html` 会发现 `HtmlWebpackPlugin` 创建了一个全新的文件，而所有的 bundle 都已自动添加到其中**。

相应地，在 `webpack.config.js` 中配置：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理输出',
    }),
  ],
};
```

需要注意，在执行构建之前，虽然在 `dist/` 文件夹已经有了自定义的 `index.html` 文件，但是 `HtmlWebpackPlugin` 插件仍然会默认生成 `index.html` 文件，即使用新生成的 `index.html` 文件替换原有文件。

不知道你有没有注意到： dist/ 文件夹下的文件就会很多，新旧产生的都混在一起，我们无法清晰知道最近一次构建的情况，因此，我们可以利用 `clean: true,` 这个 `output` 配置来清楚旧 bundle 文件。

```js
module.exports = {
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

### （3）`webpack-manifest-plugin`

这是一个用于生成 webpack 构建资产清单的插件，webpack 通过 manifest 追踪所有模块到输出的 bundle 之间的映射。**详细配置细节可查看[源码](https://github.com/shellscape/webpack-manifest-plugin)**。

- 安装：

```js
npm install webpack-manifest-plugin --save-dev
```

- 在 `webpack.config.js` 中配置：

```js
const WebpackManifestPlugin = require('webpack-manifest-plugin');
module.exports = {
  plugins: [
    new WebpackManifestPlugin(), // 可以接受一个options 参数，默认在dist目录下生成 manifest.json
  ],
};
```

重新打包，可以看见 dist 目录新生成了一个 manifest.json。

## 5. 开发环境设置

### （1）Source map：

Source map 本质上是一个信息文件，记录了转换压缩后的代码所对应的转换前的源码位置，是源代码和生产代码的映射。Source map 解决了在打包过程中，代码经过压缩，去空格以及 babel 编译转化后，由于代码之间差异性过大，造成无法 debug 的问题。

Source map 的作用就是能够让浏览器的调试面版将生成后的代码映射到源码文件当中，开发者可以在源码文件中 debug，这样就会让程序员调试轻松、简单很多。

options 种类很多[【点击查看更多】](https://webpack.docschina.org/configuration/devtool)，在生产环境下可以用 ` peocess.env` 判断一下。webpack 中可以在 devtool 中设置，

- 在开发环境中可以配置 `devtool: cheap-module-source-map` ，方便调试。
- 生产环境下建议采用`devtool: none` 或者 `devtool: nosources-source-map` ，这样子既可以定位源码位置，又可以不暴露源码。

### （2）服务启动工具：

- ### 使用 webpack-dev-server

  ```js
  npm install --save-dev webpack-dev-server
  ```

  接下来修改配置文件 `webpack.config.js` ，告诉 dev server 应从什么位置开始查找文件

  ```js
  module.exports = {
  +	devServer: {
  +   	static: './dist',
  +  	},
  +    optimization: {
  +        runtimeChunk: 'single',
  +    },
  }
  ```

  以上配置告知 `webpack-dev-server` 将 `dist` 目录下的文件作为可访问资源部署在 `localhost:8080`

- #### 使用 webpack-dev-middleware：模块热替换

  webapck-dev-middleware 是一个包装器，它可以把 webpack 处理过的文件发送到 server。这是 webpack-dev-server 内部的原理，但是它也可以作为一个单独的包使用，以便根据需求进行更多自定义设置。下面是一个 webpack-dev-middleware 配合 express server 的示例。

  ```js
  npm install --save-dev express webpack-dev-middleware
  ```

  现在调整 webpack 配置文件，以确保能够正确启用中间件：

  ```js
  module.exports = {
     mode: 'development',
     entry: {
       index: './src/index.js',
       print: './src/print.js',
     },
     devtool: 'inline-source-map',
     devServer: {
       static: './dist',
     },
     plugins: [
       new HtmlWebpackPlugin({
         title: 'Development',
       }),
     ],
     output: {
       filename: '[name].bundle.js',
       path: path.resolve(__dirname, 'dist'),
       clean: true,
   +   publicPath: '/',
     },
   };
  ```

  在 server 脚本使用 publicPath，以确保文件资源能够作为可访问资源正确部署在 `http://localhost:3000`， 接下来设置自定义 `express` server：

  **project**

  ```
  webpack-demo
    |- package.json
    |- package-lock.json
    |- webpack.config.js
    |- server.js(++++)
    |- /dist
    |- /src
      |- index.js
      |- print.js
    |- /node_modules
  ```

  **server.js**

  ```js
  const express = require('express');
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');

  const app = express();
  const config = require('./webpack.config.js');
  const compiler = webpack(config);

  // 告知 express 使用 webpack-dev-middleware，
  // 以及将 webpack.config.js 配置文件作为基础配置。
  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: config.output.publicPath,
    })
  );

  // 将文件 serve 到 port 3000。
  app.listen(3000, function () {
    console.log('Example app listening on port 3000!\n');
  });
  ```

  **package.json**

  ```json
  {
    "name": "webpack5_demo",
    "version": "1.0.0",
    "description": "",
    "private": true,
    "scripts": {
      "test": "echo \"Error: no test specified\" && exit 1",
      "watch": "webpack --watch",
      "start": "webpack serve --open",
  +   "server": "node server.js",
      "build": "webpack"
    },
    "keywords": [],
    "author": "",
    "license": "ISC",
    "devDependencies": {
      "@babel/core": "^7.23.5",
      "@babel/preset-env": "^7.23.8",
      "@babel/runtime": "^7.23.8",
      "babel-loader": "^9.1.3",
      "css-loader": "^6.9.1",
      "express": "^4.18.2",
      "html-webpack-plugin": "^5.5.3",
      "style-loader": "^3.3.3",
      "webpack": "^5.89.0",
      "webpack-cli": "^5.1.4",
      "webpack-dev-middleware": "^7.0.0",
      "webpack-dev-server": "^4.15.1",
      "webpack-manifest-plugin": "^5.0.0",
      "xml-loader": "^1.2.1"
    },
    "dependencies": {
      "@babel/plugin-transform-runtime": "^7.23.7",
      "lodash": "^4.17.21"
    }
  }
  ```

  打开浏览器，访问 `http://localhost:3000`，应该看到 webpack 应用程序已经运行！

## 6. 代码分离：

### （1）`SplitChunksPlugin `：防止重复

`SplitChunkPlugin` 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。

使用这个插件去除之前示例中重复的 `lodash` 模块：

```js
const path = require('path');

  module.exports = {
    mode: 'development',
    entry: {
      index: './src/index.js',
      another: './src/another-module.js',
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
+   optimization: {
+     splitChunks: {
+       chunks: 'all',
+     },
+   },
  };
```

使用 [`optimization.splitChunks`](https://webpack.docschina.org/plugins/split-chunks-plugin/#optimizationsplitchunks) 配置选项后构建，将会发现 `index.bundle.js` 和 `print.bundle.js` 已经移除了重复的依赖模块。从插件将 `lodash` 分离到单独的 chunk，并且将其从 main bundle 中移除，减轻了 bundle 大小。

### （2）[`mini-css-extract-plugin`](https://webpack.docschina.org/plugins/mini-css-extract-plugin)：用于将 CSS 从主应用程序中分离

### （3）分析 bundle：

- [webpack-chart](https://alexkuz.github.io/webpack-chart/)：webpack stats 可交互饼图。

- [webpack-visualizer](https://chrisbateman.github.io/webpack-visualizer/)：分析并可视化 bundle，检查哪些模块占用空间，哪些可能是重复使用的。

- [webpack-bundle-analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer)：一个 plugin 和 CLI 工具，它将 bundle 内容展示为一个便捷的、交互式、可缩放的树状图形式，实现可视化 webpack 输出文件的大小。

  修改 webpack 配置文件，可以生成一个 bundle 模块大小分析的 html 页面：

  ```js
  const BundleAnalyzerPlugin =
    require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  module.exports = {
    plugin: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 3001,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info',
      }),
    ],
  };
  ```

  ![70582940427](C:\Users\ADMINI~1\AppData\Local\Temp\1705829404271.png)

- [webpack bundle optimize helper](https://webpack.jakoblind.no/optimize)：这个工具会分析 bundle，并提供可操作的改进措施，以减少 bundle 的大小。

- [bundle-stats](https://github.com/bundle-stats/bundle-stats)：生成一个 bundle 报告（bundle 大小、资源、模块），并比较不同构建之间的结果。

## 7. 模块热替换（Hot module replacement）

模块热替换（HMR）功能会在应用程序运行过程中，替换、添加或者删除模块，而无需重新加载整个页面。

在 `webpack` 中配置开启模块也非常简单那，如下代码：

```js
const webpack = require('webpack');
module.exports = {
  // ...
  devServer: {
    // HMR
    hot: true,
    // hotOnly: true
  },
};
```

通过上面的这种配置，如果我们修改并保存 CSS 文件，确实能够与以不刷新的形式更新到页面中。但是，当我们修改并保存 JS 文件之后，页面依旧自动刷新，这里并没有触发热模块。所以，`HMR` 并不像 `webpack` 的其他特性一样开箱即用，需要有一些额外地制定和某些模块发生更新时进行`HMR`，如下代码：

```js
if (module.hot) {
  module.hot.accept('./util.js', () => {
    console.log('util.js更新了');
  });
}
```

**_警告：HMR 绝对不能被用在生产环境。_**

主要是通过以下几种方式，来提高开发速度：

- 保留在完全重新加载页面期间丢失的应用程序状态
- 只更新变更的内容，以节省宝贵的开发时间
- 在源代码中 CSS/JS 产生修改时，会立刻在浏览器中进行更新，这几乎相当于在浏览器 devtools 直接更改样式

**这一切是怎么运行的呢？或者说ＨＭＲ的工作原理是什么样子？**

（１）在应用程序中通过**置换模块**实现：

ａ．应用程序要求 HMR runtime 检查更新

b . HMR runtime 异步下载更新，然后通知应用程序

c . 应用程序要求 HMR runtime 应该更新

d . HMR runtime 同步应用更新

这里我们可以设置 HMR ，以使此进程自动触发更新，或者你可以选择要求在用户交互时进行更新。

（2）在 compiler 中：

除了普通资源，compiler 需要发出“update"，将之前的版本更新到最新的版本。”update"由 2 部分组成：

a . 更新后的 manifest（JSON）【manifest 跟踪所有模块与打包 bundle 之间的一种 hash 映射】

b . 一个或者多个 update chunk（JS）

**manifest** 包括新的 compilation hash 和所有的 updated chunk 列表。每个 chunk 都包含着全部更新模块的最新代码（或一个 flag 用于表明此模块需要被移除）。

**compiler** 会确保在这些构建之间的模块 ID 和 chunk ID 保持一致。通常将这些 ID 存储在内存中（例如，使用 [webpack-dev-server](https://webpack.docschina.org/configuration/dev-server/) 时），但是也可能会将它们存储在一个 JSON 文件中。

（3）在模块中：

HMR 是可选功能，只会影响包含 HMR 代码的模块。举个例子，通过 [`style-loader`](https://github.com/webpack-contrib/style-loader) 为 style 追加补丁。为了运行追加补丁，`style-loader` 实现了 HMR 接口；当它通过 HMR 接收到更新，它会使用新的样式替换旧的样式。

类似的，当在一个模块中实现了 HMR 接口，你可以描述出当模块被更新后发生了什么。然而在多数情况下，不需要在每个模块中强行写入 HMR 代码。如果一个模块没有 HMR 处理函数，更新就会冒泡(bubble up)。这意味着某个单独处理函数能够更新整个模块树。如果在模块树的一个单独模块被更新，那么整组依赖模块都会被重新加载。

（4）在 runtime 中：

对于模块系统运行时(module system runtime)，会发出额外代码，来跟踪模块 `parents` 和 `children` 关系。在管理方面，runtime 支持两个方法 `check` 和 `apply`。

**`check` 方法， 用来下载最新模块代码。**

具体步骤：

发送一个 Http 请求来更新 manifest 。如果请求失败，说明没有可用更新。如果请求成功，那么会将 updateed chunk 列表与当前的 loaded chunk 列表进行比较。每个 loaded chunk 都会下载响应的 updated chunk。当所有更新 chunk 完成下载，runtime 就会切换到 ready 状态。

**`apply` 方法， 用于更新模块，主要将要更新的模块打上 tag，然后调用模块的（也有可能是父模块）的更新 handler 执行更新。**

具体步骤：

1. 将所有 updated modules 标记为 无效。对于每个无效 module，都需要在模块中有一个 update handler ，或者在此模块的父级模块中有 update handler。否则，会进行无效标记冒泡，并且父级也会被标记为无效。继续每个冒泡，直到到达应用程序入口起点，或者到达带有 update handler 的 module（以最先到达为准，冒泡停止）。如果它从入口起点开始冒泡，则此过程失败。
2. 所有无效 module 都会被（通过 dispose handler）处理和解除加载。然后更新当前 hash，并且调用所有 `accept` handler。runtime 切换回 `idle` 状态，一切照常继续。

**HRM 更新的总结：**

- 通过`webpack-dev-server`创建两个服务器：提供静态资源的服务（express）和 Socket 服务
- express server 负责直接提供静态资源的服务（打包后的资源直接被浏览器请求和解析）
- socket server 是一个 websocket 的长连接，双方可以通信
- 当 socket server 监听到对应的模块发生变化时，会生成两个文件`.json`(manifest 文件)和`.js`文件(update chunk)
- 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）
- 浏览器拿到两个新文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新

## 8. [Tree-shaking](https://webpack.docschina.org/guides/tree-shaking/)：

### （1）对于 Tree-shaking 是怎么理解的？

**tree shaking** 是一种基于 ES Module 规范的 Dead Code Elimination 技术，通常用于描述移除 JavaScript 上下文中的死代码（不使用的代码）。具体是通过在运行过程中静态分析模块之间的导入导出，确定 ESM 模块中哪些导出值未曾被其他模块使用过，并将其删除，以此实现打包产物的优化。

我们打一个形象的比方：将应用程序想象成一棵树。绿色表示实际用到的源码和库，是树上活的树叶。灰色表示未引用代码，是秋天树上枯萎的树叶。为了除去死去的树叶，你必须摇动（shake）这棵树，使它们落下。

### （2）实现原理：

Webapck 中， Tree-shaking 的实现的关键是：

- 标记出模块导出值中哪些没有被用过；
- 使用 Terser 删掉这些没有被用过的导出语句。

Tree-shaking 过程大致分为四步：

> 标记功能需要配置 `optimization.usedExports = true` 开启

1）Make 阶段：在 `FlagDependencyExportsPlugin` 插件中根据模块的 `dependencies` 列表，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 体系的 exportsInfo 变量中

2）Seal 阶段： 利用 `FlagDependencyUsagePlugin` 插件，遍历 ModuleGraph 标记模块导出变量，然后收集模块的导出值的使用情况，并记录到 `exportInfo._usedInRuntime` 集合中

3）生成产物阶段：在 `HarmonyExportXXXDependency.Template.apply` 方法中根据导出值的使用情况生成不同的导出语句，若变量没有被其它模块使用过则删除对应的导出语句

4）删除阶段：使用 DCE 工具删除 Dead Code，实现完整的树摇效果

## 9.Plugin

### 9.1. 常见的 Plugin：

| plugin 名称                | 功能特性                                                     |
| -------------------------- | ------------------------------------------------------------ |
| AggressiveSplittingPlugin  | 将原来的 chunk 分为更小的 chunk                              |
| BabelMinifyWebpackPlugin   | 使用 babel-minify 进行压缩                                   |
| BannerPlugin               | 在每个生成的 chunk 顶部添加 banner                           |
| CommonsChunkPlugin         | 提取 chunks 之间共享的通用模块                               |
| CompressionWebpackPlugin   | 预先准备的资源压缩版本，使用 Content-EnCoding 提供访问的服务 |
| CleanWebpackPlugin         | 删除（清理）构建目录                                         |
| ContextReplacementPlugin   | 重写 require 表达式的推断上下文                              |
| CopyWebpackPlugin          | 将单个文件或者整个目录复制到构建目录                         |
| DefinePlugin               | 允许在编译时（compiler time）配置的全局常量                  |
| DLLPlugin                  | 为了极大减少构建时间，进行分离打包                           |
| EnvironmentPlugin          | DefinePlugin 中 process.env 键的简写方式                     |
| ExtractTextWebpackPlugin   | 从 bundle 中提取文本（CSS）到单独的文件中                    |
| HotModuleReplacementPlugin | 启动模块热替换（HMR）                                        |
| HtmlWebpackPlugin          | 简单创建 HTML 文件，用于服务器访问                           |
| IgnorePlugin               | 从 bundle 中排除某些板块                                     |
| LimitChunkCountPlugin      | 设置 chunk 的最小、最大限制，以微调和控制 chunk              |
| MiniChunkSizePlugin        | 确保 chunk 大小不超过指定限制                                |
| MiniCssExtractPlugin       | 提取 CSS 到一个单独文件中                                    |
| NoEmitOnErrorsPlugin       | 在输出阶段时，遇到编译错误跳过                               |
| NormalModuleReplacePlugin  | 替换与正则表达式匹配的资源                                   |

### 9.2. 手写一个 plugin:

#### 9.2.1. 从 html-webpack-plugin 源码中了解一个 plugin 的基本结构：

![a4fd0df4f28ef2849cd232f511013fb.png](https://s2.loli.net/2024/02/01/Ecjmr4ANixML6wK.png)

![cb711427a9240e1c21cb8de26ba875a.png](https://s2.loli.net/2024/02/01/5gyhrTGeKCajDXd.png)

源码中，使用的是 Class 类的方式来书写插件 `html-webpack-plugin` ，我们将一个功能性的函数缩起来，可以清晰得看到，其实，插件就是一个 apply() 的 Javascript 代码，在 apply() 中传入参数 compiler，然后我们可以在 compiler 对象上绑定一些 hooks 实现订阅，当监听到响应的 hooks 时，就会执行相应的插件来干预 webpack 的执行结果，达到实现某种特定功能的拓展效果。

#### 9.2.2. 如何编写一个自己的 Plugin：

由于`webpack`基于发布订阅模式，在运行的生命周期中会广播出许多事件，插件通过简听这些事件，就可以在特定阶段执行自己的插件任务。

在这之前，我们也了解过，`webpack`编译会创建 2 个核心对象：

- `compiler`：包含了`webpack`环境的所有的配置信息，包含`options`,`loader`,`plugin`和 webpack 整个生命周期中相关的钩子。

- `compilation`：作为`plugin`内置事件回调函数的参数，包含了当前的模块资源、变化的文件以及被跟踪依赖的状态信息。当检测到一个文件变化，一次新的 Compilation 将被创建。

如果要自己手写`plugin`，也需要遵循一定的规范：

- 插件必须是一个函数或者是一个包含着`apply`方法的对象，这样才能访问`compiler`实例；

- 传给每个插件的 compiler 和 compilation 对象都是同一个引用，因此不建议修改

- 异步的事件需要在插件处理完任务时调用回调函数通知`webpack`进入下一个流程，不然会卡住

实现 Plugin 的模板如下：

```js
class MyPlugin {
  // webpack会调用MyPlugin实例的apply方法给插件传入compiler对象
  apply(compiler) {
    // 找到合适的事件钩子，实现自己的插件功能
    compiler.hooks.emit.tap('MyPlugin', (compilation) => {
      // compilation:当前打包构建流程的上下文
      console.log(compilation);

      // do something
    });
  }
}
```

在`emit`事件发生时，代表源文件的转换和组装已经完成，可以读取到最终将输出的资源、代码块、模块以及依赖，并且可以修改输出资源的内容。

### 3. 手写的插件并且测试有没有成功引入：

接下来我们来启动一个 demo 来测试手写的 plugin 是否能顺利被引入。

(1)先在插件文件的 `index.js` 中书写插件的功能；

![2a0a7b00f01bbd72c225f7974e86e3f.png](https://s2.loli.net/2024/02/01/a2DyIS1V54zC9F8.png)

(2)然后在 `webpack.config.js` 中引入自己书写的 plugin，如果已经上传上 `npm` 上的插件，那就可以和其他插件一样引入，不然就引入本地文件；

![bf059714495b16b1ccea62f65796509.png](https://s2.loli.net/2024/02/01/mTi35OjzHAMuKay.png)

(3)通过 `npx webpack build ` 构建测试是否成功引入。

![0fc851173a4f7a89e31e106ac1ec649.png](https://s2.loli.net/2024/02/01/bOEwHCpZvc867IK.png)

## 10. 了解 `Webpack proxy` 的工作原理？为什么能实现跨域？

### 10.1. 具体的配置的代码如下：在`webpack` 配置对象属性中通过 `DevServer` 属性提供

```js
// ./webpack.config.js
const path = require('path');
module.exports = {
  // ...
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    proxy: {
      '/api': {
        target: 'https://api.github.com',
      },
    },
    // ...
  },
};
```

`devServer` 里面的`proxy`则是关于代理的配置，该属性为对象的形式，对象中每个属性就是一个代理的规则匹配。

对应如下：

- `target`：表示的是代理到的目标地址
- `pathRewrite`：默认情况下，我们的 `api-hy` 也会被写入到`url`中，如果希望删除，可以使用`pathRewrite`
- `secure`：默认情况下不接收转发到`https`的服务器上，如果希望支持，可设置为`false`
- `changeOrigin`：表示是否更新代理后请求的 `headers`中的`host`地址

### 10.2. 工作原理：

`proxy`工作原理实质上是利用`http-proxy-middleware` 这个`http`代理中间件，实现请求转发给其他服务器。

举个 🌰：

在开发阶段，本地地址为 `http://localhost:3000`，该浏览器发送一个前缀带有`/api`标识的请求到服务端获取数据，但是响应这个请求的服务器只是将请求转发到另一台服务器中。

```js
const express = require('express');
const proxy = require('http-proxy-middleware');

const app = express();

app.use(
  '/api',
  proxy({
    target: 'http://www.example.org',
    changeOrigin: true,
  })
);
app.listen(3000);

// http://localhost:3000/api/foo/bar
// ->
// http://www.example.org/api/foo/bar
```

### 10.3. 跨域：

在开发阶段， `webpack-dev-server`会启动一个本地开发服务器，所以我们的应用在开发阶段是独立运行在 `localhost`上的一个端口，而后端又是运行在另外一个服务器上的。

所以在开发阶段中，由于浏览器同源策略的原因，当本地访问后端就会出现跨域请求的问题。

- 通过设置`webpack proxy`实现代理请求后，相当于浏览器与服务器端添加一个代理者；

- 当本地发送请求的同时，代理服务器响应请求，并将请求转发到目标服务器，目标服务器响应数据后再将数据返回给代理服务器，最终再由代理服务器将数据响应给本地。

- 在代理服务器传递数据给本地浏览器的过程中，两者同源，并不存在跨域问题，这个时候浏览器就能正常接收数据。

**注意**：服务器与服务器之间请求数据并不会存在跨域行为，跨域行为是浏览器安全策略的限制。

## 11. `Loader`

`Loader`是一个文件加载器，加载资源文件，并对这些文件进行一些处理，如：编译、压缩等，最终打包到指定文件中。

### 11.1. 配置方式：

一般我们是写在`module.rules`属性中：

- `rules`是一个数组的形式，因此，我们可以配置很多个`loader`；
- 每个`loader`对应一个对象的形式，对象属性`test`为匹配的规则，一般情况下为正则表达式；
- 属性`use`针对匹配到文件类型，调用对应的`loader`进行处理。

**特性：**

- `loader`支持`链式调用`，链中的每个 loader 会处理之前已处理过的资源，最终转为 JS 代码，顺序为相反的顺序执行
- loader 可以是同步的，也可以是异步的
- loader 运行在 nodeJS 中，并且能够执行任何操作
- 除了常见的通过`package.json`的`main`来将一个 npm 模块导出为 loader，还可以在`module.rules`中使用 loader 字段来直接引用
- 还可以通过 loader 的预处理函数，为 JS 生态系统提供更多能力。用户可以更加灵活的引入细粒度逻辑，例如：压缩、打包、语言和其他更多特性

### 11.2. 常见的 Loader：

#### `style-loader`

将 css 添加到 DOM 的内联样式标签 style 里

#### `css-loader`

允许将 css 文件通过 require 的方式引入，并返回 css 代码

#### `less-loader`

```js
rules: [
  {
    test: /\.css$/,
    use: ['style-loader', 'css-loader', 'less-loader'],
  },
];
```

同一个任务的 loader 可以同时挂载多个，处理顺序：`从右到左，从下到上`。

**问题**：如果只使用 css-loader 加载文件，则页面样式不会生效，为什么呢？

**原因**：

css-loader 只负责将.css 文件进行解析，而不会将解析后的 css 插入到页面中；如果我们希望完成插入 style 的操作，需要引入 style-loader

#### `sass-loader`

#### `raw-loader`

在`webpack`中设置项目通过`import`方式导入文件内容

```js
module.exports = {
 ...,
 module: {
  rules: [
  {
    test: /\.(txt|md)$/,
    use: 'raw-loader'
  }
 ]
}
}
```

#### `file-loader`

把识别出的资源模块，移动到制定和的输出目录，并且返回这个资源在输出目录的地址（字符串）

#### `url-loader`

处理 file-loader 所有的事情，但是遇到图片格式的模块，可以选择地把图片转为 base 64 格式的字符串，并打包到 js 中，对小体积的图片比较适合，大图片不合适。

```js
rules:[
  ...,
  {
    test: /\.(png|jpe?g|gif)$/,
    use: {
      loader: "url-loader",
      options: {
        // placeholder 占位符[name]资源模块的名字
        // [ext]资源模块的后缀
        name:"[name]_[hash].[ext]",

        // 打包后存放的位置
        outputPath:"./images",

        // 打包后文件的url
        publicPath: './images',

        // 小于100字节转为base64格式
        limit: 100
      }
    }
  }
]
```

### 11.3. 手写`Loader`

在编写`Loader`之前，我们需要先了解`loader`的本质，

其本质为 `函数`，函数中的`this`作为上下文会被`webpack`填充，因此，我们不能将`loader`设为一个箭头函数。

函数接收一个参数，为`webpack`传递给`loader`的文件源内容；

函数中的`this`是由`webpack`提供的对象，能够获取当前`loader`所需的各种信息；

函数中有异步操作或同步操作，异步操作通过`this.callback`返回，返回值要求为`string`或`Buffer`。

代码如下：

```js
// 导出一个函数，source为webpack传递给loader的文件源内容
module.exports = function (source) {
  const content = doSomeThing2JsString(source);

  // 如果loader配置了options对象，那么this.query将指向options
  const options = this.query;

  // 可以用作解析其他模块路径的上下文
  console.log('this options');

  /*
   * this.callback 参数：
   * error：Error | null，当loader出错时向外抛出一个error
   * content: String | Buffer ，经过loader编译后需要导出的内容
   * sourceMap： 为方便调试生成的编译后的内容的 source map
   * ast；本次编译生成的AST静态语法树，之后执行的loader可以直接使用这个AST，进而省去重复生成AST的过程
   */
  this.callback(null, content); // 异步
  return content; // t同步
};
```

一般在编写 loader 的过程中，要尽量保持功能单一，避免做多种功能；

比如：less 文件转为 css 文件也不是一步到位的，而是`less-loader`、`css-loader`、`style-loader`几个 loader 的链式调用才完成转化的。

## 12. 如何提高`webpack`的构建速度？

优化`webpack`构建速度可以从`优化搜索时间`、`缩小文件搜索范围`、`减少不必要的编译` 等方面入手分析：

### 12.1. 如何优化

- 优化 loader 配置
- 合理使用 resolve.extensions
- 优化 resolve.modules
- 优化 resolve.alias
- 使用 DLLPlugin 插件
- 使用 Cache-loader
- terser 启动多线程
- 合理使用 sourceMap

#### 12.1.1. 优化 `loader` 配置

使用`loader`时，可通过配置`include`、`exclude`、`test`属性来匹配文件，接触`include`、`exclude`规定哪些匹配应用的`loader`

如采用 ES6 的项目为例，在配置 `babel-loader`：

```js
module.exports = {
  rules: [
    {
      // 如果项目源码中只有js文件就不要写成/\.jsx?$/，提升正则表达式性能
      test: /\.js$/,

      // babel-loader支持缓存转换出的结果，通过CacheDirectory选项开启
      use: ['babel-loader?cacheDirectory'],

      // 只对项目根目录下的src目录下的文件采用babel-loader
      include: path.resolve(__dirname, 'src'),
    },
  ],
};
```

#### 12.1.2. 合理使用`resolve.extensions`

在开发过程中会有各种各样的模块，这些模块可能来自于自己编写的代码，也可能是来自于第三方库， `resolve`可以帮助`webpack`从每个`require/import`语句中，找到需要引入到合适的模块代码中

通过 `resolve.extensions` 是解析到文件时自动添加扩展名，默认情况如下：

```js
module.exports ={
  ...
  extensions: ['.warn', '.json', '.js', '..mjs']
}
```

当我们引入文件的时候，若没有文件后缀名，则会根据数组内的值`依次`查找；

当我们配置时，不要随便把所有的后缀名都写在数组里，这样子会增加查找的次数，使得打包速度也变慢了。

#### 12.1.3. 优化 `resolve.modules`

`resolve.modules`用于配置`webpack`去哪些文件目录下寻找第三方模块。默认值为['node_modules']，所以默认会从`node_modules`中查找文件

当安装的第三方模块都放在项目根目录下的`./node_modules`目录下时，因此可以指明存放第三方库的绝对路径，以减少寻找的过程，配置如下：

```js
module.exports = {
  resolve: {
    // 使用绝对路径指明第三方模块存放的位置，以减少搜索的步骤
    // 其中 __dirname表示当前工作目录，也就是项目根目录
    modules: [path.resolve(__dirname, 'node_modules')],
  },
};
```

#### 12.1.4. 优化 `resolve.alias`

`alias`给一些常用的路径起一个别名，特别当我们的项目目录结构比较深的时候，一个文件路径可能是`../../../`的形式

通过配置`alias`减少查找的过程：

```js
module.exports = {
  ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
};
```

#### 12.1.5. 使用 `DLLPlugin` 插件

`DDL`(动态链接库)，是为软件在 window 这种实现共享函数库的一种实现方式，而`webpack`也内置了 DLL 的功能，为的就是能实现共享，将不经常改变的代码抽成一个共享库，这个库在之后的编译过程中，会被引入到其他项目的代码中

主要分为两个步骤：

- 打包一个`DLL`库
- 引入`DLL`库

1. 打包一个`DLL`库

webpack 内置了一个`DLLPlugin`可以帮助我们打包一个`Dll`的库文件

```js
module.exports = {
  ...
  plugins: [
    new webpack.DLLPlugin({
      name: 'dll_[name]',
      path: path.resolve(__dirname, './dll/[name].manifest.json'),
    }),
  ],
};
```

2. 引入`DLL`库

使用`webpack`自带的`DLLReferencePlugin`插件对`manifest.json`映射文件进行分析，获取要使用的`DLL库`;

然后再通过`AddAssetHtmlPlugin`插件，将我们打包的`DLL`库引入到`html`模块中

```js
module.exports = {
  ...
  new webpack.DllReferencePlugin({
    context: path.resolve(__dirname,'./dll/dll_react.js'),
    manifest: path.resolve(__dirname,'./dll/react_manifest.json'),
  }),
  new AddAssetHtmlPlugin({
    outputPath: "./auto",
    filepath: path.resolve(__dirname,'./dll/dll_react.js'),
  })
}
```

#### 12.1.6. 使用 `Cache-loader`

对于一些性能开销较大的`loader`之前添加`cache-loader`，实现将结果缓存到磁盘里，显著提升二次构建速度，不过也需要慎用，不然可能导致首次加载非常慢

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.ext$/,
        use: ['cache-loader', ...loaders],
        include: path.resolve('src'),
      },
    ],
  },
};
```

#### 12.1.7. `terser` 启动多线程

可以使用`多线程`来提高构建速度

```js
module.exports = {
  optimization: [
    minimizer: [
      new TerserPlugin({
        parallel: true,
      })
    ]
  ]
}
```

#### 12.1.8. 合理使用 `sourceMap`

sourceMap 本质上是一个信息文件，记录了转换压缩后的代码所对应的转换前的源码位置，是源代码和生产代码的映射。

打包生成 `sourceMap`的时候，如果信息越详细，打包速度就会越慢，对应的属性如下图：

| devtool                          | 构建速度 | 重新构建速度 | 生产环境 | 品质                   |
| -------------------------------- | -------- | ------------ | -------- | ---------------------- |
| `none`                           | +++      | +++          | yes      | 打包后的代码           |
| `eval`                           | +++      | +++          | no       | 生成后的代码           |
| `cheap-eval-source-map`          | +        | ++           | no       | 转换过的代码（仅限行） |
| `cheap-module-source-map`        | ○        | ++           | no       | 源代码（仅限行）       |
| `eval-source-map`                | --       | +            | no       | 源代码                 |
| `cheap-source-map`               | +        | ○            | yes      | 转换过的代码（仅限行） |
| `cheap-module-source-map`        | ○        | -            | yes      | 源代码（仅限行）       |
| `inline-cheap-source-map`        | +        | ○            | no       | 转换过的代码（仅限行） |
| `inline-cheap-module-source-map` | ○        | -            | no       | 源代码（仅限行）       |
| `source-map`                     | --       | --           | yes      | 源代码                 |
| `inline-source-map`              | --       | --           | no       | 源代码                 |
| `hidden-source-map`              | --       | --           | no       | 源代码                 |
| `nosources-source-map`           | --       | --           | yes      | 无源代码内容           |

`+++` 非常快 `++` 快 `+` 比较快 `○` 中等 `-` 比较慢 `--` 慢

## 13. 如何从 webpack 角度优化前端性能？

可以从`文件体积的大小`、`分包的形式`、`减少http请求次数`等方式入手

### 13.1. 优化的手段有：

- JS 代码压缩
- CSS 代码压缩
- HTML 代码压缩
- 文件大小压缩
- 图片压缩
- Tree Shaking
- 代码分离
- 内联 chunk

#### 13.1.1. JS 代码压缩

`terser` 是一个 Javascript 的解释、绞肉机、压缩器的工具集，可以帮助我们压缩、简化我们的代码，让`bundle`更小

在`production`模式下， `webpack`默认就是使用 `TreserPlugin`来处理的，如果想要自定义配置，也是可以的

举个 🌰：

```js
const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  ...
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true, // 电脑cpu核数 -1
      }),
    ],
  },
};
```

属性如下：

- `extractComments`:默认为 true，表示会将注释抽取到一个单独的文件中，开发阶段，我们可设置为 false，不保留注释

- `parallel`:使用多进程并发运行提高构建的速度，默认为 true，并发运行的默认数量:os.cpus().length -1

- `terserOptions`:设置我们的`terser`相关配置

- `compress`:设置压缩相关的选项，

- `mangle`：设置简化的相关选项，可以设置为 true

- `toplevel`:设置底层变量是否进行转化

- `keep_classnames`:保留类的名称

- `keep_fnames`:保留函数的名称

#### 13.1.2. CSS 代码压缩

CSS 压缩通常是去除无用的空格等。

CSS 压缩我们也可以使用插件：`css-minimizer-webpack-plugin`

```js
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
module.exports = {
  ...
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
  },
};
```

#### 13.1.3. HTML 代码压缩

使用`HtmlWebpackPlugin`插件来生成 HTML 的模板的时候，通过配置属性`minify`进行 html 优化

```js
module.exports = {
  ...
  plugin: [
    new HtmlwebpackPlugin({
      ...
      minify: {
        minifyCSS: false, // 是否压缩css
        collapseWhitespace: false, //是否折叠空格
        removeComments: true, //是否移除注释
      },
    }),
  ],
};
```

设置了 minify，实际上会使用另一个插件 html-minifier-terser

#### 13.1.4. 文件大小压缩

对文件大小压缩，减少`http`传输过程中宽带的损耗

```js
new ComepressionPlugin({
  test: /\.(css|js)$/, //哪些文件需要压缩
  threshold: 500, // 设置文件多大开始压缩
  minRatio: 0.7, // 至少压缩的比例
  algorithm: 'gzip', // 采用的压缩算法
});
```

#### 13.1.5. 图片压缩

```js
module: {
  rules: [
    {
      test: /\.(png|jpg|gif)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'images/',
          },
        },
        {
          loader: 'image-webpack-loader',
          options: {
            // 压缩jpeg的配置
            mozjpeg: {
              progressive: true,
              quality: 65,
            },
            // 使用imagemin**-optipng 压缩 png， enable: false为关闭
            optipng: {
              enabled: false,
            },
            // 使用imagemin-pngquant 压缩 png
            pngquant: {
              quality: '65-90',
              speed: 4,
            },
            // 压缩gif
            gifsicle: {
              interlaced: false,
            },
            // 开启webp，会把 jpg 和 png 图片压缩为 webp格式
            webp: {
              quality: 75,
            },
          },
        },
      ],
    },
  ];
}
```

#### 13.1.6. Tree Shaking

`Tree shaking` 依赖于 ES module 的静态语法分析。

在`webpack`实现`Tree shaking`有两种方案：

- `usedExports`: 通过标记某些函数是否被使用过，之后通过`terser`进行优化

- `sideEffects`: 跳过某些文件、模块，直接查看该文件、模块是否有副作用

1. usedExports

```js
module.exports = {
  optimization: {
    usedExports,
  },
};
```

使用之后，没被用上的代码在 webpack 打包中会加上`unused harmony export mul`注释，用来告知 `Terser`在优化时，可以将这段代码删除。

2. sideEffects

`sideEffects`用来告知 webpack compiler 哪些模块有副作用

如果 sideEffects 设置为 false，就是告知 webpack 可以安全删除未用到的 exports

如果有些文件需要保留，可以设置为数组的形式

```js
"sideEffects":[
 "./src/util/format.js",
 "*.css" // css
]
```

不仅仅 JS 有 Tree shaking，css 也有。

CSS 可以使用`purgecss-plugin-webpack`插件实现:

```js
const PurgeCssPlugin = require('purgecss-webpack-plugin')
module.exports = {
 plugins:[
  new PurgeCssPlugin({
    path:glob.sync(`${path.resolve('./src')}/**/*`), {nodir:true}
  // src里面的所有文件
    satelist:function(){
      return {
        standard:["html"]
      }
    }
 })
 ]
}
```

- path：表示要检测哪些目录下的内容需要被分析，配合使用 glob
- 默认情况，Purgecss 会将我们的 html 标签的样式移除，如果我们希望保留，可以添加一个`safelist`属性

#### 13.1.7. 代码分离

将代码分离到不同的 bundle 中，之后可以按需加载，或者并行加载这些文件

默认情况，所有 JS 文件会在首页全部加载，影响首屏速度。

代码分离为更小的 bundle，以及控制资源加载的优先级，可以提高代码的加载性能。

这里可以通过`splitChunksPlugin`插件来实现，该插件默认安装和集成，只需要配置即可。

但是在默认设置中，chunks 仅仅针对异步（async）请求，我们可以设置为 initial /all

```js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};
```

splitChunks 主要属性：

- Chunks:对同步代码还是异步代码进行处理
- minSize:拆分包的大小，至少为 minSize，如果这个包大小不超过 minSize，那么不拆包
- maxSize:将大于 maxSize 的包拆分为不小于 minSize 的包
- minChunks:被引入的次数，默认 1

#### 13.1.8. 内联 chunk

可以通过 InlineChunkHtmlPlugin 插件将一个 chunk 的模块内联到 html，如 runtime 的代码（对模块进行解析、加载、模块信息相关的代码），代码量并不大，但是必须加载的

```js
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {

 plugin:[
  new InlineChunkHtmlPlugin(HtmlWebpackPlugin,[/runtime.+\.js/]
 ]
}
```

## 14. 优秀参考文档：

- [webpack 源码](https://github.com/webpack/webpack/tree/main)
- [手写 plugin](https://zhuanlan.zhihu.com/p/410749514)
- [webpack 源码阅读方法](https://github.com/gweid/webpack-source-code?tab=readme-ov-file)

## 「❤️ 感谢大家」

本文只是自己学习 webpack 过程中整理的思路和梳理，希望后学者提供一点帮助。其实也是抛砖引玉啦，欢迎大家评论区讨论，留下自己的想法 ❤️

如果觉得不错，麻烦大家帮忙点个赞，关注一下吖
