const path = require('path'),
  HtmlWebPackPlugin = require('html-webpack-plugin'),
  phaserModule = path.join(__dirname, '/node_modules/phaser/'),
  phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');


module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: 'dist'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      include: path.resolve(__dirname, 'src/'),
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }, {
      test: /pixi\.js/, loader: 'expose?PIXI'
    }, {
      test: /phaser-split\.js$/, loader: 'expose?Phaser'
    }, {
      test: /p2\.js/, loader: 'expose?p2'}
    ],
    noParse: [
      path.resolve(__dirname, 'node_modules/phaser/build/phaser.js')
    ]
  },
  resolve: {
    alias: {
      'phaser': phaser,
      'pixi': pixi,
      'p2': p2,
    }
  },
  plugins: [
    new HtmlWebPackPlugin({template: 'index.html'})
  ]
};
