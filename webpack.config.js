'use strict';
var webpack = require('webpack'),
	path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');
var precss = require('precss');
module.exports = {
	context: __dirname + '/src-frontend',
	entry: {
		app: './index.js'
	},
	output: {
		path: __dirname + '/public/js/',
		filename: 'app.js'
	},
	module: {
		loaders: [{
			test: /\.scss$/,
			loader: ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
		},{
		  test: /\.(png|jpg|gif|svg)$/,
		  loader: "file-loader?name=../assets/img/static/[name].[ext]"
		}]
	},
	plugins: [
	new ExtractTextPlugin("../css/style.css", {
		allChunks: true
	})],
	postcss: function() {
		return [autoprefixer, precss];
	}
}