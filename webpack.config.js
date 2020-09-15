module.exports = {
	entry: './src/index',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.css$/,
				use: [
				  'style-loader',
				  {
					loader: 'css-loader',
					options: {
					  importLoaders: 1,
					  modules: false
					}
				  }
				]
			  }
		]
	}
};