<template>
<!-- 中转页面 -->
  <div></div>
</template>

<script>
export default {
    name:"transfer",
    created(){
        this.$router.push(this.url)
    },
    data(){
        return{
            url:this.$route.query.url,
        }
    },
}
</script>

<style>

</style>