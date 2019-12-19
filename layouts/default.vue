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
  },
  computed: {
    ...mapGetters(['localStorageName'])
  },
  mounted () {
    // 將localStorage存的資料餵給store
    var localStorageData = JSON.parse(localStorage.getItem(this.localStorageName))
    if (localStorageData) {
      this.$store.commit(action.common.updateUserVideoLibrary, localStorageData)
    }
  }
}
</script>

<style lang="scss">
@import '~/assets/scss/global.scss'
</style>