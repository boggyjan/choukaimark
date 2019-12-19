<template>
  <div class="site-wrapper">
    <search-bar
      @changeVideo="gotoVideo($event)" />
    <div class="main">
      <div class="video-list">
        <nuxt-link
          v-for="(item, i) in userVideoLibrary"
          :key="`video_item_${i}`"
          :to="localePath({ name: 'id', params: { id: item.vid } })"
          class="video-list__item">
          <div class="video-list__item-thumb">
            <img :src="`https://img.youtube.com/vi/${ item.vid }/0.jpg`" class="video-list__item-thumb-img">
          </div>
          <div class="video-list__item-text">
            <div class="video-list__item-text-title">
              {{ item.title || item.vid }}
            </div>
            <div class="video-list__item-text-desc">
              {{ $t('index.num_of_marks', { s: item.marks.length }) }}
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>
    <!-- https://www.youtube.com/watch?v=EQApmmLyFqQ -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SiteHeader from '~/components/SiteHeader.vue'
import SearchBar from '~/components/SearchBar.vue'

export default {
  head () {
    let title = this.$t('index.meta_title')
    let desc = this.$t('index.meta_desc')
    let image = 'https://choukai.boggy.tw/images/fb.jpg'
    return {
      title: title,
      meta: [
        { hid: 'description', name: 'description', content: desc },
        { hid: 'twitter:type', name: 'twitter:type', content: 'summary_large_image' },
        { hid: 'twitter:title', name: 'twitter:title', content: title },
        { hid: 'twitter:description', name: 'twitter:description', desc },
        { hid: 'twitter:image', name: 'twitter:image', content: image },
        { hid: 'og:type', name: 'og:type', content: 'website' },
        { hid: 'og:title', name: 'og:title', content: title },
        { hid: 'og:description', name: 'og:description', content: desc },
        { hid: 'og:image', name: 'og:image', content: image },
        { hid: 'og:url', name: 'og:url', content: process.env.DOMAIN + this.$route.fullPath }
      ],
      htmlAttrs: {
        lang: this.$i18n.locales.filter(item => item.code === this.$i18n.locale)[0].iso
      }
    }
  },
  components: {
    SiteHeader,
    SearchBar
  },
  computed: {
    ...mapGetters(['userVideoLibrary'])
  },
  methods: {
    gotoVideo (vid) {
      if (vid && vid.indexOf('http') > -1) {
        var parseUrl = vid.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)
        vid = parseUrl.length ? parseUrl[1] : vid
        console.log(vid)
      }
      this.$router.push(this.localePath({ name: 'id', params: { id: vid } }))
    }
  }
}
</script>
