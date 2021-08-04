module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  publicPath: process.env.NODE_ENV === 'production'
    ? '/timetable/'
    : '/',
  chainWebpack: config => {
    config
        .plugin('html')
        .tap(args => {
            args[0].title = "Dijla University";
            return args;
        })
}
}
