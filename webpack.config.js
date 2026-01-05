import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get environment variables with defaults
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const CDN_URL = process.env.WIDGET_CDN_URL || '';

// Common configuration shared between both bundles
const commonConfig = {
  mode: IS_DEVELOPMENT ? 'development' : 'production',
  devtool: IS_DEVELOPMENT ? 'eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: IS_DEVELOPMENT
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      }
    ]
  },
  resolve: {
    extensions: ['.mjs', '.js', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT: JSON.stringify(IS_DEVELOPMENT),
      CDN_URL: JSON.stringify(CDN_URL)
    }),
    ...(IS_DEVELOPMENT ? [new webpack.HotModuleReplacementPlugin()] : [])
  ],
  ...(IS_DEVELOPMENT && {
    watchOptions: {
      aggregateTimeout: 300,
      poll: 1000,
      ignored: /node_modules/
    }
  })
};

// Configuration for UI Components (npm package)
const packageConfig = {
  ...commonConfig,
  name: 'package',
  entry: './src/components/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/package'),
    filename: 'index.js',
    library: {
      type: 'umd',
      name: 'WidgetComponents'
    },
    globalObject: 'this',
    umdNamedDefine: true,
    clean: true
  },
  externals: {
    svelte: {
      commonjs: 'svelte',
      commonjs2: 'svelte',
      amd: 'svelte',
      root: 'Svelte'
    }
  }
};

// Configuration for Injectable Widget (with iframe)
const injectableConfig = {
  ...commonConfig,
  name: 'injectable',
  entry: {
    widget: './src/widget/index.js',
    iframe: './src/iframe/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/injectable'),
    filename: '[name].js',
    library: {
      name: 'Widget',
      type: 'umd',
      export: 'default',
    },
    clean: true,
    publicPath: '/'
  },
  plugins: [
    ...commonConfig.plugins,
    new HtmlWebpackPlugin({
      template: './src/iframe/index.html',
      filename: 'widget.html',
      chunks: ['iframe']
    }),
    new HtmlWebpackPlugin({
      template: './src/app/index.html',
      filename: 'index.html',
      chunks: ['widget']
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist/injectable'),
      publicPath: '/',
    },
    compress: true,
    port: 3000,
    hot: true,
    liveReload: true,
    watchFiles: ['src/**/*'],
    devMiddleware: {
      writeToDisk: true,
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    }
  }
};

// Configuration for Injectable Widget as NPM Package (with iframe)
const iframePackageConfig = {
  ...commonConfig,
  name: 'iframe-package',
  entry: {
    widget: './src/widget/index.js',
    iframe: './src/iframe/main.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist/iframe-package'),
    filename: '[name].js',
    library: {
      type: 'umd',
      name: 'IframeWidget',
      export: 'default',
    },
    globalObject: 'this',
    umdNamedDefine: true,
    clean: true
  },
  plugins: [
    ...commonConfig.plugins,
    new HtmlWebpackPlugin({
      template: './src/iframe/index.html',
      filename: 'widget.html',
      chunks: ['iframe']
    })
  ],
  externals: {
    svelte: {
      commonjs: 'svelte',
      commonjs2: 'svelte',
      amd: 'svelte',
      root: 'Svelte'
    }
  }
};

export default [packageConfig, injectableConfig, iframePackageConfig]; 