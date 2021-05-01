<template>
  <div id="app">
    <Top />
    <Index :isRouterAlive="isRouterAlive"/>
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
  // provide(){
  //   return{
  //     reload:this.reload()
  //   }
  // },
  data(){
    return{
      isRouterAlive:true
    }
  },
  methods:{
    // reload(){
    //   this.isRouterAlive=false
    //   this.$nextTick(function(){
    //     this.isRouterAlive=true
    //   })
    // }
  }
}
</script>

<style>

</style>
