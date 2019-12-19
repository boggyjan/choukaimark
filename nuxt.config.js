
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  server: {
    host: '0.0.0.0', // default: localhost
    port: 8888
  },
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    // 'bootstrap-vue/nuxt',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    'nuxt-i18n',
  ],
  /*
  ** i18n module configuration
  */
  i18n: {
    locales: [
      { code: 'tw', name: '繁體中文', iso: 'zh-Hant', file: 'tw.js' },
      { code: 'en', name: 'English', iso: 'en', file: 'en.js' },
      { code: 'ja', name: '日本語', iso: 'ja', file: 'ja.js' }
    ],
    lazy: true,
    langDir: './i18n/',
    defaultLocale: 'tw',
    vueI18n: {
      fallbackLocale: 'tw'
    },
    vuex: {
      moduleName: 'i18n',
      syncLocale: true
    },
    detectBrowserLanguage: {
      useCookie: true,
      alwaysRedirect: false
    },
    baseUrl: 'https://choukai.boggy.tw/'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}

// package.json
//   "dependencies": {
//     "bootstrap": "^4.1.3",
//     "bootstrap-vue": "^2.0.0"
//   }
