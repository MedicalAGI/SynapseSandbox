const path = require('path')
const fs = require('fs')

const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const appPackageJson = require('./package.json')

const getProxyConfig = require('./proxy')
const PACKAGE = require('./package.json')
const lessToJS = require('./scripts/postcss-val-to-less')

const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, 'src/theme.module.css'), 'utf8'),
)
const version = PACKAGE.version

const cssModuleReg = /\.module\.css$/

const getStyleLoaders = (enableCssModule, isProductionMode) => {
  const use = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '/',
      },
    },
    {
      loader: 'css-loader',
      options: {
        sourceMap: true,
        importLoaders: 1,
        localsConvention: 'camelCase',
        modules: enableCssModule
          ? {
              localIdentName: isProductionMode
                ? '[hash:base64:5]'
                : '[path][name]__[local]--[hash:base64:5]',
            }
          : false,
      },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            'postcss-inline-svg',
            [
              'postcss-preset-env',
              {
                stage: 0,
                features: {
                  'nesting-rules': true,
                },
              },
            ],
          ],
        },
      },
    },
  ]
  return use
}

module.exports = (env = {}, argv) => {
  const isProductionMode = argv.mode === 'production'
  const isPipeLineMode = env.pipeline

  const config = {
    target: 'web',
    entry: {
      app: ['./src/index.tsx'],
    },
    output: {
      filename: isProductionMode ? '[name].[chunkhash].js' : '[name].js',
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: '[name].[chunkhash].js',
      publicPath: isPipeLineMode ? '/OCAN3iuZK15iAmZg1ZSq/' : '/',
    },
    optimization: {
      minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
      splitChunks: {
        chunks: 'all',
      },
    },
    module: {
      rules: [
        {
          test: /\.worker\.(j|t)s$/i,
          loader: 'worker-loader',
        },
        {
          test: /\.m?js/,
          resolve: {
            fullySpecified: false,
          },
        },
        {
          test: /\.(j|t)sx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              babelrc: true,
              plugins: [
                // ... other plugins
                !isProductionMode && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        },
        {
          test: /\.css$/,
          exclude: cssModuleReg,
          use: getStyleLoaders(false, isProductionMode),
        },
        {
          test: cssModuleReg,
          use: getStyleLoaders(true, isProductionMode),
        },
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {},
            },
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
                modifyVars: themeVariables,
              },
            },
          ],
        },
        {
          test: /.(eot|ttf|woff|woff2|otf)/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 0,
                name: '[name].[ext]',
                publicPath: './fonts/',
                outputPath: './fonts/'
              }
            }
          ]
        },
        {
          test: /\.(png|jpg|gif?)$/,
          use: [
            {
              loader: 'url-loader'
            }
          ]
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack', 'url-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
      fallback: {
        crypto: false,
        fs: false,
      },
    },
    plugins: [
      !isProductionMode &&
        new ForkTsCheckerWebpackPlugin({
          eslint: {
            enabled: true,
            files: './src/**/*.{ts,tsx,js,jsx}',
          },
        }),
      new webpack.EnvironmentPlugin({
        NODE_ENV: isProductionMode ? 'production' : 'development',
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new MiniCssExtractPlugin({
        filename: isProductionMode ? '[name].[chunkhash].css' : '[name].css',
        chunkFilename: isProductionMode ? '[id].[chunkhash].chunk.css' : '[id].chunk.css',
        ignoreOrder: true,
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
        favicon: './public/favicon.png',
      }),
      !isProductionMode && new ReactRefreshWebpackPlugin()
    ].filter((plugin) => Boolean(plugin)),
    devServer: {
      historyApiFallback: {
        disableDotRule: true,
      },
      client: {
        progress: true
      },
      hot: true,
      compress: true,
      port: 4203,
      proxy: getProxyConfig(),
    },
    devtool: !isProductionMode && 'eval-cheap-module-source-map',
  }
  return config
}
