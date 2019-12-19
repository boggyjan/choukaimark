<template>
  <div class="site-header">
    <nuxt-link
      :to="localePath({ name: 'index' })"
      v-if="!isHome"
      class="site-header-back-btn">
      <img src="~/assets/images/left_arrow.svg" :alt="$t('index.back')" class="site-header-back-btn-icon">
      {{ $t('index.back') }}
    </nuxt-link>
    <span v-else>
      {{ $t('index.site_title') }}
    </span>
  </div>
</template>

<script>
export default {
  computed: {
    isHome () {
      return this.$route.name.indexOf('index') > -1
    }
  }
}
</script>