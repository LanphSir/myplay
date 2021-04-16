<template>
<!-- 主页面 -->
  <div id="index">
      <!-- 导航 -->
      <div class="nav">
          <ul>
            <li>
            <router-link to="/discovery">
                <span class=""></span>
                发现音乐
            </router-link>
            </li>
            <li>
            <router-link to="/songslist">
                <span class=""></span>
                推荐歌单
            </router-link>
            </li>
            <li>
            <router-link to="/newsongs">
                <span class=""></span>
                最新音乐
            </router-link>
            </li>
            <li>
            <router-link to="/newmv">
                <span class=""></span>
                最新MV
            </router-link>
            </li>
        </ul>
      </div>
      <!-- 主体 -->
      <div class="main">
          <router-view></router-view>
      </div>
      <!-- 播放 -->
      <div class="player">
          
        <div class="">
            <ul>
                <li v-for="(item,index) in playList" :key="index" @click="playIndex=index">
                   {{index}} - {{item.id}} - {{item.name}}<i class="el-icon-close" @click.stop="removeMusic(index)"></i>
                </li>
            </ul>
        </div>
        <input type="radio" value="" id="musicListbut" hidden>
        <label for="musicListbut" class="listbut"></label>
        <!-- <audio :src="playUrl" :autoplay="isautoplay" controls @ended="orderPlay()">
        </audio> -->
        <Myaudio ref="audio" :url="playUrl" :isautoplay="isautoplay" :img="playList.length===0?require('./../assets/img/default_album.jpg'):playList[playIndex].al.picUrl" :songname="playList.length===0?null:playList[playIndex].name" :arname="playList.length===0?null:playList[playIndex].ar[0].name" :checkOrder="setEnded()"/>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
import Myaudio from './media/myaudio.vue'
export default {
    name:'index',
    components:{
        Myaudio
    },
    created(){
        window.$Bus.$on('musicId',data=>{
            this.musicId=data
            this.getPlayMusicInfo(data)
            // 查询是否有重复
            let index=0;
            this.playList.forEach(item => {
                if(item.id==data){
                    return index;
                }else{
                    index++
                }
            });
            if(this.playList.length==index){
                this.getMusicInfo(data)
            }
            
        })
        window.$Bus.$on('isAutoplay',data=>{
            this.isautoplay=data
        })
    },
    data() {
        return{
            // 歌曲id
            musicId:"",
            // 是否自动播放
            isautoplay:"",
            // 播放地址
            playUrl:"",
            // 播放列表
            playList:[],
            // 播放位置索引 
            playIndex:0,
            // playorder:this.$refs.audio.playorder(),
        }
    },
    watch:{
        // 歌曲位置索引改变时重新加载
        playIndex(){
            if(this.playList.length!=0){
                this.getPlayMusicInfo(this.playList[this.playIndex].id)
            }
        },
    },
    methods:{
        // 获取歌曲播放信息
        getPlayMusicInfo(id){
            axios({
            url:"https://autumnfish.cn/song/url",
            method:'get',
            params:{
                id
            }
            }).then(res=>{
                this.playUrl = res.data.data[0].url
            })
        },
        // 获取歌曲信息
        getMusicInfo(ids){
            axios({
                url:"https://autumnfish.cn/song/detail",
                method:'get',
                params:{
                    ids
                }
            }).then(res=>{
                this.playList.unshift(res.data.songs[0])
                console.log(this.playList);
            })
        },
        setEnded(){
            // console.log(this);
            this.$nextTick(()=>{
                switch (this.$refs.audio.playOrder) {
                case 'order':
                    this.orderPlay()
                    break;
                case 'random':
                    this.randomPlay()
                    break;
                case 'loop':
                    this.loopPlay()
                    break;
            
                default:
                    break;
            }
            })
            
        },
        // 顺序播放
        orderPlay(){
            // 如果播放列表只有一首歌曲，则单曲循环，否则播放下一首
            if(this.playList.length==1){
                this.loopPlay()
            }else{
                this.playIndex++
                if(this.playList.length==this.playIndex){
                    this.playIndex=0
                }
            }
        },
        //单曲循环
        loopPlay(){
            this.$refs.audio.playSong()
        },
        //随机播放
        randomPlay(){
            if(this.playList.length==1){
                this.loopPlay()
            }else{
                // 随机获取0~playList.length-1的整数
                this.playIndex=Math.floor(Math.random()*this.playList.length)
            }
        },
        // 从列表中移除
        removeMusic(index){
            this.playList.splice(index,1)
            if(this.playList.length==0){
                this.playUrl=""
            }else{
                if(this.playIndex==index){
                    this.getPlayMusicInfo(this.playList[this.playIndex].id)
                }
            }
        }
    },
    destroyed(){
        window.$Bus.$off('musicId')
        window.$Bus.$off('isAutoplay')
    }
}
</script>

<style>

</style>