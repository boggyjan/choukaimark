<template>
  <div class="search-bar">
    <input
      v-model="vid"
      :placeholder="$t('index.please_input_youtube_url')"
      class="search-bar--input" type="text">
    <button
      @click="$emit('changeVideo', vid)"
      class="search-bar--submit" type="button">{{ $t('index.change_video_btn') }}</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      vid: ''
    }
  }
}
</script>
