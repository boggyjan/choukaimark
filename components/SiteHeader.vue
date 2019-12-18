<template>
  <div class="site-header">
    <div class="row">
      <div class="col">
        <div>Choukai Marker</div>
      </div>
      <div class="col-auto">
        <div class="d-flex">
          <input type="text" v-model="vid" class="form-control mr-1">
          <button
            @click="$emit('changeVideo', vid)"
            class="btn btn-secondary">Change</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      vid: this.videoId
    }
  },
  watch: {
    videoId (val) {
      this.vid = val
    }
  },
  props: ['videoId']
}
</script>
