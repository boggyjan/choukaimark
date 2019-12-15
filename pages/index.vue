<template>
  <div class="site-wrapper">
    <site-header :videoId="videoId" @changeVideo="playVideo($event)" />
    <div class="main">
      <div class="yt-player">
        <div id="player"></div>
        <div class="timeline-wrapper">
          <div class="timeline">
            <div
              v-for="(mark, idx) in marks"
              :key="`timeline_mark_${idx}`"
              @click="playFromMark(mark)"
              :style="`
                left: ${ mark.start / videoDuration * 100 }%;
                width: ${ (mark.end - mark.start) / videoDuration * 100 }%;
              `"
              class="time-item"></div>
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
          <ul class="list-group">
            <li
              v-for="(mark, idx) in marks"
              :key="`list_mark_${idx}`"
              @click="playFromMark(mark)"
              class="list-group-item">
              {{ Math.floor(mark.start * 10) / 10 }}s
              -
              {{ Math.floor(mark.end * 10) / 10 }}s
            </li>
          </ul>
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
      videoId: 'IzlqgYAYmCc',
      videoDuration: 0,
      markable: false,
      markTime: {
        start: 0,
        end: 0
      },
      marks: []
    }
  },
  components: {
    SiteHeader
  },
  methods: {
    onYouTubeIframeAPIReady () {
      if (this.videoId) {
        this.playVideo()
      }
    },
    onPlayerReady(event) {
      this.videoDuration = this.player.getDuration()
    },
    changeBorderColor(playerStatus) {
      this.markable = false
      if (playerStatus == -1) {
        // unstarted
      } else if (playerStatus == 0) {
        // ended
      } else if (playerStatus == 1) {
        // playing
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
        this.markTime.start = this.player.getCurrentTime()
      }
    },
    markEnd () {
      if (this.markable) {
        this.markTime.end = this.player.getCurrentTime()
        this.makeMark(this.markTime.start, this.markTime.end)
      }
    },
    makeMark (start, end) {
      this.marks.push({ start, end })
    },
    playVideo (vid) {
      this.marks = []
      if (vid) {
        this.videoId = vid
      }
      if (!this.player) {
        this.player = new window.YT.Player(this.playerId, {
          width: '100%',
          height: '450',
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
