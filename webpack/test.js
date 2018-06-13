var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('./base.js')

var webpackConfig = merge(config, {
	devtool: true
})

module.exports = webpackConfig