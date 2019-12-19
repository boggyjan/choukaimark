<template>
  <div class="site-footer">
    Copyright &copy; {{ new Date().getFullYear() }} Boggy Jang.
    <div class="locales">
      <nuxt-link
        v-for="locale in availableLocales"
        :key="locale.code"
        :to="switchLocalePath(locale.code)"
        class="locales--link">{{ locale.name }}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    }
  }
}
</script>
