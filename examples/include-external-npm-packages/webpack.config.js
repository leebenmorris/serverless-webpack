const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // hello: './hello.js',
    longLink: './longLink.js',
    // gp: './gp.js',
    // carDB: './carDB',
    getArticlesOrCommentsByArticleId: './getArticlesOrCommentsByArticleId',
    getDomainsOrArticlesByDomainId: './getDomainsOrArticlesByDomainId',
    postArticle: './postArticle',
    postComment: './postComment'
  },
  target: 'node',
  externals: [nodeExternals()], // exclude external modules
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: __dirname,
      exclude: /node_modules/,
    }]
  },
  devtool: 'cheap-module-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ]
};
