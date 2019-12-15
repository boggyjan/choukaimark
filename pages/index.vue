<template>
  <div class="site-wrapper">
    <site-header />
    <div class="row">
      <div class="col-sm-8">
        <div id="player" style="border-width: 3px;"></div>
        <a href="#" class="btn btn-primary"
          @mousedown.prevent="markStart()"
          @mouseup.prevent="markEnd()">Mark</a>
      </div>
      <div class="col-sm-4">
        <ul class="list-group">
          <li class="list-group-item" v-for="mark in marks">
            {{ Math.floor(mark.start * 10) / 10 }}s
            -
            {{ Math.floor(mark.end * 10) / 10 }}s
          </li>
        </ul>
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
      this.player = new window.YT.Player(this.playerId, {
          width: '100%',
          height: '450',
          videoId: 'IzlqgYAYmCc',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange': this.onPlayerStateChange
          }
      })
    },
    onPlayerReady(event) {
      document.getElementById(this.playerId).style.borderColor = '#FF6D00'
    },
    changeBorderColor(playerStatus) {
      var color
      this.markable = false
      if (playerStatus == -1) {
        color = "#37474F" // unstarted = gray
      } else if (playerStatus == 0) {
        color = "#FFFF00" // ended = yellow
      } else if (playerStatus == 1) {
        this.markable = true
        color = "#33691E" // playing = green
      } else if (playerStatus == 2) {
        color = "#DD2C00" // paused = red
      } else if (playerStatus == 3) {
        color = "#AA00FF" // buffering = purple
      } else if (playerStatus == 5) {
        color = "#FF6DOO" // video cued = orange
      }
      if (color) {
        document.getElementById(this.playerId).style.borderColor = color
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
    }
  },
  mounted () {
    this.initYTApi()
    window.onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady
  }
}
</script>
