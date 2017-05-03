const nodeExternals = require('webpack-node-externals');
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    longLink: './ffs_lambda_functions/longLink.js',
    getArticlesOrCommentsByArticleId: './ffs_lambda_functions/getArticlesOrCommentsByArticleId',
    getDomainsOrArticlesByDomainId: './ffs_lambda_functions/getDomainsOrArticlesByDomainId',
    postArticle: './ffs_lambda_functions/postArticle',
    postComment: './ffs_lambda_functions/postComment',
    changeArticleVotes: './ffs_lambda_functions/changeArticleVotes'
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
