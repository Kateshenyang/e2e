const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    hot: true, // Включение горячей перезагрузки
    historyApiFallback: true, // Обработка маршрутов для SPA
    port: 9000, // Установка порта
  },
});
