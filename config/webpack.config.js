// const webpack = require("webpack");
const path= require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); //html模板解析插件
const {CleanWebpackPlugin} = require("clean-webpack-plugin"); //打包清除文件夹
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //css打包插件
const { VueLoaderPlugin } = require('vue-loader')
// const CopyWebpackPlugin = require("copy-webpack-plugin"); //拷贝插件
//设置nodejs环境变量
// process.env.NODE_ENV = "development";
const isProduction=process.env.NODE_ENV === "production" 

// 
const getStyleLoaders = (pre) => {
  return [
    isProduction? {
      loader: MiniCssExtractPlugin.loader,    
      options: {      
        // publicPath: '../'
      }
    }
      : "vue-style-loader",
    "css-loader",
    {
      // 处理css兼容性问题
      // 配合package.json中browserslist来指定兼容性
      loader: "postcss-loader",
      options: {
        postcssOptions: {
          plugins: ["postcss-preset-env"],
        },
      },
    },
    pre && {
      loader: pre,
      options:
        pre === "sass-loader"
          ? {
              additionalData: `@use "@/styles/element/index.scss" as *;`,
            }
          : {},
    },
  ].filter(Boolean);
};

module.exports = {
  entry:"./src/main.js", 
  output: {
    path: path.resolve(__dirname , "./dist"), //打包后的文件存放的地方
    filename: "js/chunk.[hash:8].js", //打包后输出文件的文件名
    // assetModuleFilename: "media/[hash:10][ext][query]",
  },
  resolve: {
    extensions: ['.*','.vue', '.js', '.json'],
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  //配置webpack开发服务功能
  devServer: {
    // contentBase: resolve(__dirname,'dist'), //本地服务器所加载的页面所在的目录
    host: "localhost",
    // watchContentBase: true, //监视目录下的文件，变化时reload
    compress: true,//启动gzip压缩
    port: 8080,
    hot:true,
    // clientLogLevel:'none',//不要显示启动服务器日志信息
    // quiet:true
  }, 
  module: {
    // 规则
    rules: [
      {
        test: /\.css$/,
        use:getStyleLoaders(),
      },
      {
        test: /\.less$/,
        use: getStyleLoaders("less-loader"),
      },
      {
        test: /\.s[ac]ss$/,
        use: getStyleLoaders("sass-loader"),
      },
      {
        test: /\.styl$/,
        use: getStyleLoaders("stylus-loader"),
      },
      {
        test: /\.(woff2?|ttf)$/,
        type: "asset/resource",
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "../src"), //只加载src目录下的js
        loader:'babel-loader',
        options:{
          presets:[
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns:'usage',
                // 指定版本
                corejs:{
                  version:3
                },
                //兼容版本
                targets:{
                  chrome:'60',
                  firefox:'60',
                  ie:'9',
                  safari:'10',
                  edge:'17',
                }
              }
            ]
          ]
        }
      },
      {
        test: /\.vue$/,
        use:[
          'vue-loader',
        ]
      },
      {
        test: /\.(jpg|png|svg|gif|bmp|jpeg)$/,
        // use: {
          // loader: "url-loader",
          type:"asset/resource",
          generator: {
            filename: 'img/[hash:8].[name].[ext]'
          }
          // options: {
          //   esModule: false,
          //   name: "img/[hash:8].[name].[ext]",
          //   limit: 1000 * 10,  //单位字节 超过10k不处理
          //   // publicPath: "../",
          //   // publicPath: "/dist/",
          // },
        // },
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-withimg-loader",
          options: {
            attrs: ["img:src", "img:data-src", "audio:src"],
            minimize: true,
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      minify: {
        // 压缩操作
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true, // 压缩内联css
        removeAttributeQuotes: true, // 删除模板中的双引号
      },
      hash: true,
    }),
    new CleanWebpackPlugin(),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css"
    }),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: resolve.resolve(__dirname, "./src/js/"),
    //       to: resolve.resolve(__dirname, "./dist/js/"),
    //       flatten: true,
    //       globOptions: {
    //         ignore: ["**/src/js/main.js"],
    //       },
    //     },
    //   ],
    // }),
  ],
  mode: 'development',
  devtool: "source-map"
};
