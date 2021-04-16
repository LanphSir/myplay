<template>
<!-- 最新音乐 -->
  <div class="newsongs">
    <!-- 分类标签 -->
    <ul class="hottags">
      <li v-for="item in tags" :key="item.id" @click="tag = item.id" :class="{active:tag==item.id}"> 
        {{item.name}}
      </li>
    </ul>
    <!--  -->
    <div class="newsong">
      <div class="items">
        <div class="item" v-for="(item,index) in songlist" @click="playMusic(item.id)" :key="index" :style="{width:100/1-2+'%'}">
          <div class="img-wrap">
            <img :src="item.album.blurPicUrl" alt="">
            <button class="play"></button>
          </div>
          <div class="row-wrap">
            <span>{{item.name}}<i style="color:red;margin-left:5px;" v-if="(item.mvid)!=0" class="el-icon-video-play" @click.stop="toMvInfo(item.mvid)"></i></span>
            <span>{{item.album.artists['0'].name }}</span>
            <span>{{item.album.name }}</span>
            <span>{{duration(item.duration )}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:'newsongs',
  data(){
    return {
      // 最新热歌
      songlist:[],
      //所有标签
      tags:[{name:"全部",id:0},
          {name:"华语",id:7},
          {name:"欧美",id:96},
          {name:"日本",id:8},
          {name:"韩国",id:16}],
      //选中的标签
      tag:0,
    }
  },
  created(){
    this.getSonglist();
  },
  watch:{
    //选中的标签发生变化时触发事件
    tag(){
      this.getSonglist()
    }
  }
  ,
  methods:{
    // 获取最新热歌
    getSonglist(){
      axios({
        url:'https://autumnfish.cn/top/song',
        method:'get',
        params:{
          // 传递 设置的数据
          /* type:必选参数 
          全部:0
          华语:7
          欧美:96
          日本:8
          韩国:16
          */
            type: this.tag
        },
      }).then(res=>{
        console.log(res.data.data);
        this.songlist=res.data.data
      })
    },
     //计算歌曲时间
    duration(dt){
      let min=parseInt(dt/1000/60);
      let sec=parseInt((dt/1000)%60);
      if(min<10){
          min='0'+min;
      }
      if(sec<10){
          sec='0'+sec;
      }
      return min+':'+sec;
    },
    //播放歌曲
    playMusic(id){
      this.$indexjs.playMusic(id);
    },
    toMvInfo(id){
      //跳转到mv播放页面
      this.$router.push({
          path:'/mvInfo',
          query:{
              id
          }
      })
    },
  }
}
</script>

<style>

</style>