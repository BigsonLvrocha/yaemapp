module.exports = {
  configureWebpack: {
    devtool: 'eval-source-map',
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? '/yaemapp/'
    : '/',
};
