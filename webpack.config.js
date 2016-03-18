'use strict';
var webpack = require('webpack'),
	path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var precss = require('precss');
module.exports = {
	context: __dirname + '/src',
	entry: {
		app: './index.js'
	},
	output: {
		path: __dirname + '/js/',
		filename: 'app.js'
	},
	module: {
		loaders: [{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
		}]
	},
	plugins: [
	new ExtractTextPlugin("../view/css/style.css", {
		allChunks: true
	})],
	postcss: function() {
		return [autoprefixer, precss];
	}
}