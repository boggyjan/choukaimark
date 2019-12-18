<template>
  <div class="site-wrapper">
    <site-header
      :videoId="videoId"
      @changeVideo="setVideo($event)" />
    <div class="main">
      <div class="yt-player" v-show="videoId">
        <div id="player"></div>
        <div class="timeline-wrapper">
          <div class="timeline">
            <a
              v-for="(mark, idx) in marks"
              :key="`timeline_mark_${idx}`"
              @click.prevent="playFromMark(mark)"
              :style="`
                left: ${ mark.start / videoDuration * 100 }%;
                width: ${ (mark.end - mark.start) / videoDuration * 100 }%;
              `"
              href="#"
              class="time-item"></a>
          </div>
        </div>
      </div>
      <div class="container-fluid">
        <div class="actions">
          <a
            @mousedown.prevent="markStart()"
            @mouseup.prevent="markEnd()"
            :class="{ disabled: !markable }"
            href="#"
            class="btn btn-primary">Mark</a>
        </div>
        <div>
          <div class="list-group">
            <a
              v-for="(mark, idx) in marks"
              :key="`list_mark_${idx}`"
              @click.prevent="playFromMark(mark)"
              href="#"
              class="list-group-item">
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
import SiteHeader from '~/components/SiteHeader.vue'

export default {
  data () {
    return {
      player: null,
      playerId: 'player',
      videoId: null,
      videoDuration: 0,
      markable: false,
      dataStore: [],
      interval: null,
      version: 1
    }
  },
  watch: {
    dataStore: {
      deep: true,
      handler (val) {
        console.log('watched!')
      }
    }
  },
  computed: {
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
    },
    storeName () {
      return `ckm_ds__v_${this.version}`
    }
  },
  components: {
    SiteHeader
  },
  methods: {
    onYouTubeIframeAPIReady () {
      if (this.videoId) {
        this.setVideo()
      }
    },
    onPlayerReady(event) {
    },
    changeBorderColor(playerStatus) {
      this.markable = false
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
        // video cued
      }
    },
    onPlayerStateChange(event) {
      this.changeBorderColor(event.data)
    },
    initYTApi () {
      if (window && window.YT && window.YT.Player) {
        onYouTubeIframeAPIReady()
      } else {
        var tag = document.createElement('script')
        tag.src = "https://www.youtube.com/iframe_api"
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }
    },
    apiOnLoad () {
      this.onYouTubeIframeAPIReady()
    },
    markStart () {
      if (this.markable) {
        var time = this.player.getCurrentTime()
        this.makeMark(time, time)
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
      localStorage.setItem(this.storeName, JSON.stringify(this.dataStore))
    },
    makeMark (start, end) {
      this.marks.push({ start, end })
    },
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
          width: '100%',
          height: '400',
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
    playFromMark ({ start, end }) {
      this.player.seekTo(start, true)
      this.player.playVideo()
    }
  },
  mounted () {
    this.initYTApi()
    window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady
  }
}
</script>
