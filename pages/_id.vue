<template>
  <div class="site-wrapper">
    <div class="main">
      <div class="ytplayer" v-show="videoId">
        <div class="ytplayer-wrapper">
          <div id="player"></div>
        </div>
        <div class="timeline-wrapper">
          <div class="timeline">
            <a
              v-for="(mark, idx) in marks"
              :key="`timeline_item_${idx}`"
              @click.prevent="playFromMark(mark)"
              :style="`
                left: ${ mark.start / videoDuration * 100 }%;
                width: ${ (mark.end - mark.start) / videoDuration * 100 }%;
              `"
              href="#"
              class="timeline--item"></a>
          </div>
        </div>
      </div>
      <div class="mark-edit">
        <div class="actions">
          <div
            @mousedown.prevent="markStart()"
            @mouseup.prevent="markEnd()"
            :class="{ disabled: !markable }"
            href="#"
            class="mark-btn">{{ $t('index.mark_btn') }}</div>
        </div>
        <div>
          <div class="marks-list">
            <a
              v-for="(mark, idx) in marks"
              :key="`marks-list_item_${idx}`"
              @click="playFromMark(mark)"
              href="#"
              class="marks-list__item">
              {{ Math.floor(mark.start * 10) / 10 }}s
              -
              {{ Math.floor(mark.end * 10) / 10 }}s
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  head () {
    let title = `${this.$t('index.player_page_title')} - ${this.$t('index.site_title')}`
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
  data () {
    return {
      player: null,
      playerId: 'player',
      // videoId: null, // in asyncData
      videoDuration: 0,
      markable: false,
      dataStore: this.dataStore || [],
      interval: null,
      version: 1
    }
  },
  watch: {
    // dataStore: {
    //   deep: true,
    //   handler (val) {
    //     console.log('watched!')
    //   }
    // }
    userVideoLibrary (val) {
      this.dataStore = JSON.parse(JSON.stringify(val))
    }
  },
  computed: {
    ...mapGetters(['userVideoLibrary']),
    //
    // yt thumb https://img.youtube.com/vi/IzlqgYAYmCc/0.jpg
    //
    marks () {
      if (this.videoId) {
        if (!this.dataStore.filter(data => data.vid === this.videoId).length) {
          this.dataStore.push({
            vid: this.videoId,
            marks: []
          })
        }
        return this.dataStore.filter(data => data.vid === this.videoId)[0].marks
      } else {
        return null
      }
    }
  },
  methods: {
    initYTApi () {
      window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady
      //
      if (window && window.YT && window.YT.Player) {
        this.onYouTubeIframeAPIReady()
      } else {
        var tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }
    },
    onYouTubeIframeAPIReady () {
      if (this.videoId) {
        this.setVideo(this.videoId)
      }
    },
    // 沒有播放器即建立播放器，然後播放影片
    setVideo (vid) {
      if (vid && vid.indexOf('http') > -1) {
        var parseUrl = vid.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&]{10,12})/)
        vid = parseUrl.length ? parseUrl[1] : vid
      }
      //
      // this.marks = []
      if (vid) {
        this.videoId = vid
      }
      if (!this.player) {
        this.player = new window.YT.Player(this.playerId, {
          // width: '100%',
          // height: '400',
          videoId: this.videoId,
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          }
        })
      } else {
        this.player.loadVideoById(this.videoId, 0, 'large')
      }
    },
    onPlayerReady (event) {
      this.videoDuration = this.player.getDuration()
    },
    onPlayerStateChange (event) {
      var playerStatus = event.data
      this.markable = false
      //
      if (playerStatus == -1) {
        // unstarted
      } else if (playerStatus == 0) {
        // ended
      } else if (playerStatus == 1) {
        // playing
        this.videoDuration = this.player.getDuration()
        this.markable = true
      } else if (playerStatus == 2) {
        // paused
      } else if (playerStatus == 3) {
        // buffering
      } else if (playerStatus == 5) {
        this.videoDuration = this.player.getDuration()
        // video cued
      }
    },
    markStart () {
      if (this.markable) {
        var time = this.player.getCurrentTime()
        this.marks.push({ start: time, end: time })
        this.interval = setInterval(this.updateMarkTime, 10)
      }
    },
    updateMarkTime () {
      if (this.markable) {
        this.marks[this.marks.length - 1].end = this.player.getCurrentTime()
      }
    },
    markEnd () {
      this.updateMarkTime()
      clearInterval(this.interval)
      this.$store.dispatch('updateUserVideoLibrary', this.dataStore)
    },
    playFromMark ({ start, end }) {
      this.player.seekTo(start, true)
      this.player.playVideo()
    }
  },
  async asyncData ({ params, req, res, app }) {
    return {
      videoId: params.id
    }
  },
  mounted () {
    if (this.userVideoLibrary.length) {
      this.dataStore = JSON.parse(JSON.stringify(this.userVideoLibrary))
    }
    this.initYTApi()
  },
  beforeDestroy () {
    if (this.player) {
      this.player.destroy()
    }
    clearInterval(this.interval)
  }
}
</script>
