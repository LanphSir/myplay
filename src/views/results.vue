<template>
  <div class="results">
    <div class="tab">
      <div class="title-warp">
        <h2 class="title">{{ keywords }}</h2>
        <span class="sub-title">找到 {{ count }} 个结果</span>
      </div>
      <el-tabs v-model="activeName"
      v-infinite-scroll="load"
          infinite-scroll-disabled="disabled"
      >
        <el-tab-pane label="单曲" name="song">
            <div class="newsong">
                <div class="items">
                    <div class="item item-head" :style="{width:100/1-2+'%'}">
                        <span class=""></span>
                        <div class="img-wrap">
                        </div>
                        <div class="row-wrap">
                            <span>歌名</span>
                            <span>作者</span>
                            <span>专辑</span>
                            <span>时长</span>
                        </div>
                    </div>
                    <div class="item" 
                    v-for="(item,index) in resultList" 
                    @click="playMusic(item.id)" 
                    :key="index" 
                    :style="{width:100/1-2+'%'}">
                        <span class="index">{{index+1}}</span>
                        <div class="img-wrap">
                            <img :src="item.al.picUrl" alt="">
                            <button class="play"></button>
                        </div>
                        <div class="row-wrap">
                            <span>{{item.name}}
                              <i style="color:red;margin-left:5px;" 
                              v-if="(item.mv)!=0" 
                              class="el-icon-video-play" 
                              @click.stop="toMvInfo(item.mv)">
                              </i></span>
                            <span>{{item.ar[0].name }}</span>
                            <span>{{item.al.name }}</span>
                            <span>{{duration(item.dt )}}</span>
                        </div>
                    </div>
                </div>
            </div>
         
        </el-tab-pane>
        <el-tab-pane label="歌单" name="songs">
          <div class="items">
            <div
              class="item"
              v-for="(i, index) in resultSongList"
              @click="toSongsInfo(i.id)"
              :style="{ width: 100 / 5 - 2 + '%' }"
              :key="index"
            >
              <div class="img-wrap">
                <span class="img-righttop">点击量:{{ i.playCount }}</span>
                <img :src="i.coverImgUrl" alt="" />
                <button class="play"></button>
              </div>
              <span class="name-wrap">{{ i.name }}</span>
            </div>
            <p></p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="mv" name="mv">
          <div class="mv">
            <div class="items">
              <div
                class="item"
                :style="{ width: 100 / 4 - 2 + '%' }"
                v-for="(i, index) in resultMvList"
                @click="toMvInfo(i.id)"
                :key="index"
              >
                <div class="img-wrap">
                  <span class="img-righttop"
                    ><i class="el-icon-caret-right"></i> {{ i.playCount }}</span
                  >
                  <img :src="i.cover" alt="" />
                  <button class="play"></button>
                </div>
                <div>
                  <p>{{ i.name }}</p>
                  <p>{{ i.artistName }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <p style="text-align: center; margin: 20px" v-if="loading">加载中...</p>
      <p style="text-align: center; margin: 20px" v-if="noMore">没有更多了</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "result",
  // components:{
  // },
  created() {
    //搜素音乐
    this.searchSong();
  },
  data() {
    return {
      //传入参数
      keywords: this.$route.query.keywords,
      //单曲搜索结果
      resultList: [],
      // 歌单搜索结果
      resultSongList: [],
      // mv搜索结果
      resultMvList: [],
      //搜索匹配数量
      count: 0,
      //tab被选中选项，默认为单曲
      activeName: "song",
      // 记录'加载更多'次数
      loadsize: 0,
      // 加载
      loading: false,
    };
  },
  watch: {
    // 标签页改变
    activeName() {
      this.loadsize = 0;
      // this.resultList = [];
      switch (this.activeName) {
        case "song":
          this.searchSong();
          break;
        case "songs":
          this.searchSongs();
          break;
        case "mv":
          this.searchMv();
          break;
        default:
          break;
      }
    },
    loadsize() {
      switch (this.activeName) {
        case "song":
          this.searchSong();
          break;
        case "songs":
          this.searchSongs();
          break;
        case "mv":
          this.searchMv();
          break;
        default:
          break;
      }
    }
  },
  computed: {
    noMore() {
      switch (this.activeName) {
        case "song":
          return this.count <= this.resultList.length;
        case "songs":
          return this.count <= this.resultSongList.length;
        case "mv":
          return this.count <= this.resultMvList.length
        default:
          return this.count <= this.resultList.length;
      }
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  methods: {
    //计算歌曲时间
    duration(dt) {
      let min = parseInt(dt / 1000 / 60);
      let sec = parseInt((dt / 1000) % 60);
      if (min < 10) {
        min = "0" + min;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }
      return min + ":" + sec;
    },
    rowClick(row, column, event) {
      console.log(row, column, event);
      this.playMusic(row.id);
    },
    //简化播放量
    roundCount: (playcount) => {
      if (playcount <= 100000) {
        return playcount;
      } else {
        return parseInt(playcount / 10000) + "万";
      }
    },
    //播放音乐
    playMusic(id) {
      this.$indexjs.playMusic(id);
    },
      //搜素单曲
    searchSong() {
      axios({
        url: "https://autumnfish.cn/cloudsearch",
        method: "get",
        params: {
          keywords: this.keywords,
          limit: 20+this.loadsize * 10,
          type: 1,
          // offset: this.loadsize * 10,
          /* 可选
                    limit : 返回数量 , 默认为 30 
                    offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
                    type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
                    */
        },
      }).then((res) => {
        this.resultList=res.data.result.songs
        this.count = res.data.result.songCount;
        for (let item of this.resultList) {
          item.al.dt = this.duration(item.dt);
        }
      });
    },
      //搜素歌单
    searchSongs() {
      axios({
        url: "https://autumnfish.cn/cloudsearch",
        method: "get",
        params: {
          keywords: this.keywords,
          limit: 10+this.loadsize * 10,
          type: 1000,
          // offset: this.loadsize * 10,
        },
      }).then((res) => {
        this.resultSongList=res.data.result.playlists
        this.count = res.data.result.playlistCount;
        for (let item of this.resultSongList) {
          item.playCount = this.roundCount(item.playCount);
        }
      });
    },
      //搜素mv
    searchMv() {
      axios({
        url: "https://autumnfish.cn/cloudsearch",
        method: "get",
        params: {
          keywords: this.keywords,
          limit: 8+this.loadsize*8,
          type: 1004,
          // offset: this.loadsize * 8,
        },
      }).then((res) => {
        this.resultMvList=res.data.result.mvs
        this.count = res.data.result.mvCount;
        for (let item of this.resultMVList) {
          item.duration = this.duration(item.duration);
          item.playCount = this.roundCount(item.playCount);
        }
      });
    },
      //跳转到歌单详细信息页面
    toSongsInfo(id) {
      this.$router.push({
        path: "/songsInfo",
        query: {
          id,
        },
      });
    },
      //跳转到mv播放页面
    toMvInfo(id) {
      this.$router.push({
        path: "/mvInfo",
        query: {
          id,
        },
      });
    },
    // 加载更多
    load() {
      this.loading = true;
      setTimeout(() => {
        this.loadsize++;
        this.loading = false;
      }, 2000);
    },
  },
};
</script>

<style>
</style>