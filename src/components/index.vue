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
      <router-view v-if="isRouterAlive"></router-view>
    </div>
    <!-- 播放 -->
    <div class="player">
      <div class="playList" @click.stop="">
        <label for="musicListbut" class="listbut"></label>
        <input type="checkbox" value="" id="musicListbut" v-model="checked"  hidden />
        <div class="song-list" ref="songlist">
          <div class="song-list-del">
            <i class="el-icon-delete-solid" @click="clearList()">清空列表</i>
          </div>
          <ul class="" v-show="playList.length!=0">
            <li
              v-for="(item, index) in playList"
              :key="index"
              @click="playIndex = index"
              :title="item.name + '--' + item.ar[0].name + '--' + item.al.name"
            >
              <p>
                <span>{{ item.name }}</span>
                <span>&#8212;</span> 
                <span>{{ item.ar[0].name }}</span>
                <span>&#8212;</span>
                <span>{{ item.al.name }}</span>
              </p>
              <i class="el-icon-close" @click.stop="removeMusic(index)"></i>
            </li>
          </ul>
          <div class="nosong" v-show="playList.length==0">
            <p>暂未添加播放歌曲，快去添加喜欢的歌曲吧</p>
          </div>
        </div>
      </div>
      <!-- 音乐播放器 -->
      <Myaudio
        ref="audio"
        :url="playUrl"
        :isautoplay="isautoplay"
        :img="
          playList.length === 0
            ? require('./../assets/img/default_album.jpg')
            : playList[playIndex].al.picUrl
        "
        :songname="playList.length === 0 ? null : playList[playIndex].name"
        :arname="playList.length === 0 ? null : playList[playIndex].ar[0].name"
        @setended="setEnded()"
        @last="lastsong()"
        @next="nextsong()"
      />
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Myaudio from "./media/myaudio.vue";
import {
  setSession,
  getSession,
  clearSession
} from "../util/sessionStorageUtil"
export default {
  name: "index",
  props:{
    isRouterAlive:Boolean
  },
  components: {
    Myaudio,
  },
  created() {
    window.$Bus.$on("musicId", (data) => {
      this.musicId = data;
      this.getPlayMusicInfo(data);
      // 查询是否有重复
      let index = 0;
      if(this.playList.length!=0){
        for (let item of this.playList) {
          if (item.id == data) {
            break;
          } else {
            index++;
          }
        }
        if (this.playList.length == index) {
          this.getMusicInfo(data);
          this.playIndex = 0;
        }
        else{
          this.playIndex = index;
        }
      }else{
        this.getMusicInfo(data);
        this.playIndex = 0;
      }
    });
    window.$Bus.$on("isAutoplay", (data) => {
      this.isautoplay = data;
    });
    if(getSession('playList')!=null){
      this.playList=getSession('playList')
      this.playUrl=getSession("playUrl")
      // this.playUrl=this.playList[this.playIndex].playUrl
    }
  },
  mounted(){
      this.clickDocument()
  },
  data() {
    return {
      // 歌曲id
      musicId: "",
      // 是否自动播放
      isautoplay: "",
      // 播放地址
      playUrl: null,
      // 播放列表
      playList: [],
      // 播放位置索引
      playIndex: 0,
      // 播放列表选中
      checked:false,
    };
  },
  watch: {
    // 歌曲位置索引改变时重新加载
    playIndex() {
      if (this.playList.length != 0) {
        this.getPlayMusicInfo(this.playList[this.playIndex].id);
      }
    },
  },
  methods: {
    // 获取歌曲播放信息
    getPlayMusicInfo(id) {
      axios({
        url: "https://autumnfish.cn/song/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        this.playUrl = res.data.data[0].url;
        setSession("playUrl",this.playUrl)
      });
    },
    // 获取歌曲信息
    getMusicInfo(ids) {
      axios({
        url: "https://autumnfish.cn/song/detail",
        method: "get",
        params: {
          ids,
        },
      }).then((res) => {
        this.playList.unshift(res.data.songs[0]);
        setSession("playList",this.playList)
      });
    },
    // 根据选择设置播放顺序
    setEnded() {
      this.$nextTick(() => {
        console.log(this.$refs.audio.playOrder);
        switch (this.$refs.audio.playOrder) {
          case "order":
            this.orderPlay();
            break;
          case "random":
            this.randomPlay();
            break;
          case "loop":
            this.loopPlay();
            break;

          default:
            break;
        }
      });
    },
    // 上一曲
    lastsong() {
      if (this.playList.length != 0) {
        if (this.playIndex == 0) {
          this.playIndex = this.playList.length - 1;
        } else {
          this.playIndex--;
        }
      }
    },
    // 下一曲
    nextsong() {
      if (this.playList.length != 0) {
        if (this.playIndex == this.playList.length - 1) {
          this.playIndex = 0;
        } else {
          this.playIndex++;
        }
      }
    },
    // 顺序播放
    orderPlay() {
      // 如果播放列表只有一首歌曲，则单曲循环，否则播放下一首
      if (this.playList.length == 1) {
        this.loopPlay();
      } else {
        this.playIndex++;
        if (this.playList.length == this.playIndex) {
          this.playIndex = 0;
        }
      }
    },
    //单曲循环
    loopPlay() {
      this.$refs.audio.playSong();
    },
    //随机播放
    randomPlay() {
      if (this.playList.length == 1) {
        this.loopPlay();
      } else {
        // 随机获取0~playList.length-1的整数
        this.playIndex = Math.floor(Math.random() * this.playList.length);
      }
    },
    // 从列表中移除
    removeMusic(index) {
      this.playList.splice(index, 1);
      if (this.playList.length == 0) {
        this.playUrl = "";
      } else {
        if (this.playIndex == index) {
          this.getPlayMusicInfo(this.playList[this.playIndex].id);
        }
      }
      setSession("playList",this.playList)
    },
    //清空播放列表
    clearList(){
      clearSession("playList")
      this.playList=[];
      this.playUrl=""
    },
    //
    clickDocument(){
      let tmp=this
      document.onclick=function(){  
        tmp.checked=false
        }
    },
  },
  destroyed() {
    window.$Bus.$off("musicId");
    window.$Bus.$off("isAutoplay");
  },
};
</script>

<style scoped>
  .myaudio{
    /* position: absolute; */
    margin-left: 50%;
    transform: translateX(50%);
  }
</style>