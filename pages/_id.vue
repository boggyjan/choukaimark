<template>
  <div class="site-wrapper">
    <div class="main">
      <div class="ytplayer" v-show="vid">
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
            @mousedown.prevent="markStart(0)"
            @mouseup.prevent="markEnd()"
            @touchstart.prevent="markStart(0)"
            @touchend.prevent="markEnd()"
            :class="{ disabled: !markable }"
            href="#"
            class="mark-btn mark-btn-0">{{ $t('index.mark_type_0') }}</div>
          <div
            @mousedown.prevent="markStart(1)"
            @mouseup.prevent="markEnd()"
            @touchstart.prevent="markStart(1)"
            @touchend.prevent="markEnd()"
            :class="{ disabled: !markable }"
            href="#"
            class="mark-btn mark-btn-1">{{ $t('index.mark_type_1') }}</div>
          <div
            @mousedown.prevent="markStart(2)"
            @mouseup.prevent="markEnd()"
            @touchstart.prevent="markStart(2)"
            @touchend.prevent="markEnd()"
            :class="{ disabled: !markable }"
            href="#"
            class="mark-btn mark-btn-2">{{ $t('index.mark_type_2') }}</div>
        </div>
        <div>
          <div class="marks-list">
            <a
              v-for="(mark, idx) in marksReverse"
              :key="`marks-list_item_${idx}`"
              @click="playFromMark(mark)"
              href="#"
              class="marks-list__item">
              <span class="duration">
                {{ Math.floor(mark.start * 10) / 10 }}s
                -
                {{ Math.floor(mark.end * 10) / 10 }}s
              </span>
              <span :class="`type-${mark.type}`" class="type">{{ $t(`index.mark_type_${mark.type || 0}`) }}</span>
              <span @click.prevent.stop="removeMark(mark)" class="remove-btn">{{ $t('index.remove_mark') }}</span>
            </a>
          </div>
        </div>
      </div>
      <div class="export">
        <a
          v-if="marks.length"
          @click.prevent="exportMarks()"
          href="#" class="export-btn">{{ $t('index.export_marks') }}</a>
        <textarea v-if="exportContent" v-model="exportContent" class="export-content"></textarea>
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
      title: '',
      marks: [],
      player: null,
      videoDuration: 0,
      markable: false,
      currentType: 0,
      interval: null,
      exportContent: '',
      //
      playerId: 'player'
    }
  },
  computed: {
    marksReverse () {
      return Object.assign([], this.marks).reverse()
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
      if (this.vid) {
        this.setVideo(this.vid)
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
        this.vid = vid
      }
      if (!this.player) {
        this.player = new window.YT.Player(this.playerId, {
          // width: '100%',
          // height: '400',
          videoId: this.vid,
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          },
          playerVars: {
            playsinline: 1
          }
        })
      } else {
        this.player.loadVideoById(this.vid, 0, 'large')
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
        if (!this.title) {
          var videoData = event.target.getVideoData()
          this.$store.dispatch('setVideoTitleById', { vid: this.vid, title: videoData.title})
        }
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
    markStart (type) {
      this.currentType = type
      if (this.markable) {
        var time = this.player.getCurrentTime() - 0.5 < 0 ? 0 : this.player.getCurrentTime() - 0.5
        this.marks.push({ start: time, end: time, type: this.currentType })
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
      this.$store.dispatch('setVideoMarksById', { vid: this.vid, marks: JSON.parse(JSON.stringify(this.marks)) })
    },
    playFromMark ({ start, end }) {
      this.player.seekTo(start, true)
      this.player.playVideo()
    },
    removeMark ({ start, end }) {
      var idx = this.marks.findIndex(item => item.start === start && item.end === end)
      this.marks.splice(idx, 1)
      this.$store.dispatch('setVideoMarksById', { vid: this.vid, marks: JSON.parse(JSON.stringify(this.marks)) })
    },
    exportMarks () {
      var output = this.title + ' Marks\r\n\r\n'
      this.marks.forEach(mark => {
        output += `${Math.floor(mark.start * 100) / 100} - ${Math.floor(mark.end * 100) / 100} [${this.$t(`index.mark_type_${mark.type || 0}`)}]\r\n`
      })
      this.exportContent = output
    }
  },
  async asyncData ({ params, req, res, app }) {
    return {
      vid: params.id
    }
  },
  async mounted () {
    var videoData = await this.$store.dispatch('getVideoData', this.vid)
    this.title = videoData.title
    this.marks = videoData.marks
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
