<template>
  <div class="site-wrapper">
    <site-header />
    <nuxt />
    <site-footer />
  </div>
</template>

<script>
import action from '~/store/action'
import { mapGetters } from 'vuex'
import SiteHeader from '~/components/SiteHeader.vue'
import SiteFooter from '~/components/SiteFooter.vue'

export default {
  components: {
    SiteHeader,
    SiteFooter
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/global.scss'
</style>