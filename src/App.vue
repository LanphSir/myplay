<template>
  <div id="app">
    <Top />
    <Index />
  </div>
</template>

<script>
import Index from './components/index.vue';
import Top from './components/top.vue';

export default {
  name: 'app',
  components: {
    Index,
    Top
  },
}
</script>

<style>

</style>
