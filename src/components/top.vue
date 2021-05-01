<template>
  <div class="top">
      <div class="history">
          <i class="el-icon-arrow-left" @click="toback()"></i>
          <i class="el-icon-arrow-right" @click="toforward()"></i>
      </div>
      <div class="search" @click.stop="changesearchlist()">
          <input type="text" v-model.trim="inputValue" @keydown.enter="toResult()" @keyup="keyupEvent()" @keydown="keydownEvent()"  class="search-value">
          <button class="search-but" @click="toResult()"><i class="el-icon-search"></i></button>
          <div class="searchlist" ref="searchlist">  
              <ul>
                  <li v-for="item in result" :key="item.id" @click="playMusic(item.id)">
                     {{item.name}}-{{item.ar[0].name}}
                  </li>
              </ul>
          </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name:'top',
    mounted(){
        this.changedocument()
    },
    data(){
        return{
            // 输入值
            inputValue:"",
            // 搜索结果预览
            result:[]
        }
    },
    watch:{
        // $route() {
        //     this.$router.go(0);
        // },
    },
    methods:{
        getSearch(keywords){
            axios({
                url:"https://autumnfish.cn/cloudsearch",
                method:'get',
                params:{
                    keywords,
                    limit:10
                }
            }).then(res=>{
                this.result=res.data.result.songs
                console.log(this.result);
            })
        },
        keyupEvent(){
            setTimeout(()=>{
                this.getSearch(this.inputValue)
            },500)
        },
        keydownEvent(){
            clearTimeout();// 取消定时器
        },
        // 
        playMusic(id){
            this.$indexjs.playMusic(id)
        },
        // 跳转
        toResult() {
            // 非空判断
            if (this.inputValue == '') {
            // 提示用户
            this.$message.warning('请输入内容')
            }else{
                // 先中转，再携带数据去搜索页
                // this.$router.push('/result?keywords='+this.inputValue)
                this.$router.push('/transfer?url='+'/result?keywords='+this.inputValue)
            }
        },
        //后退
        toback(){
            this.$router.go(-1);
        },
        // 前进
        toforward(){
            this.$router.go(1);
        },
        // 点击搜索区域searchlist显示
        changesearchlist(){
            this.$refs.searchlist.style.display="block"
        },
        // 点击任意区域searchlist隐藏
        changedocument(){
            // let dom=this.$refs.searchlist
            // document.onclick=function(){
            //     dom.style.display="none"
            // }
            this.$indexjs.clickDocument(this.$refs.searchlist)
        },

    }
}

</script>

<style>

</style>