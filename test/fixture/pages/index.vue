<template>
  <div>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-if="content.body" v-html="content.body.html" />
    <hr>
    Content generated at {{ content.generatedAt }}
  </div>
</template>

<script>
export default {
  data () {
    return {
      content: {}
    }
  },
  async fetch () {
    this.content = await globalThis.$fetch('/_content/blog/2021.md')
  },
  mounted () {

  }
}
</script>
