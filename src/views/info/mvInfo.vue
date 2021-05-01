<template>
  <!-- mv详情 -->
  <div class="mvinfo">
    <div class="content">
      <!-- mv播放  -->
      <div class="mv-warp">
        <div class="video">
          <video controls :src="mvurl"></video>
        </div>
        <div class="info-wrap">
          <div class="singer-info">
            <div class="auther-wrap" style="margin-top: 10px">
              <!-- 头像 -->
              <img
                :src="icon"
                class="img-round"
                width="50"
                height="50"
                alt=""
              />
              <!-- 歌手名 -->
              <span class="name">{{ mv.artistName }}</span>
            </div>
          </div>
          <div class="mv-info">
            <!-- 标题 -->
            <h2 class="title">{{ mv.name }}</h2>
            <span class="date info-grey">发布：{{ mv.publishTime }}</span>
            <!-- 播放次数 -->
            <span class="number info-grey">播放：{{ mv.playCount }}次</span>
            <!-- 描述 -->
            <p
              class="desc"
              style="margin: 10px 0px 0px 10px"
              v-html="replace(mv.desc)"
            ></p>
            <a href="#" class="descbut" @click="checkdesc()">展开</a>
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comments">
        <h3>评论</h3>
        <span class="info-grey">共{{ total }}条评论</span>
        <div class="comment" v-if="total != 0">
          <div v-if="topcomments.length != 0">
            <h2>置顶</h2>
            <div>
              <div
                class="item comment-all"
                v-for="{ item, index } in topcomments"
                :key="index"
              >
                <div class="column-wrap">
                  <a class="nickname">{{ item.user.nickname }}</a>
                  <img
                    width="50"
                    height="50"
                    :src="item.user.avatarUrl"
                    alt=""
                  />
                </div>
                <div class="comment-right">
                  <div class="comment-center">
                    ：<span v-html="replace(item.content)"></span>
                  </div>
                  <div class="conment-font">
                    <span class="time info-grey">{{ format(item.time) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="hotcomments.length != 0">
            <h2>精彩评论</h2>
            <div
              class="item comment-all"
              v-for="{ item, index } in hotcomments"
              :key="index"
            >
              <div class="column-wrap comment-user">
                <a class="nickname">{{ item.user.nickname }}</a>
                <img width="50" height="50" :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment-right">
                <div class="comment-center">
                  ：<span v-html="replace(item.content)"></span>
                </div>
                <div class="comment-font">
                  <span class="time info-grey">{{ format(item.time) }}</span>
                  <div class="comment-font-1">
                    <div>
                      <img width="15" class="zan" alt="" />
                      <span style="color: #1296db">{{ item.likedCount }}</span>
                    </div>
                    <div>
                      <img width="15" class="discuss" alt="" />
                      <span style="color: #1296db">{{
                        item.beReplied.length
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2>最新评论</h2>
            <div
              class="item comment-all"
              v-for="item in comments"
              :key="item.id"
            >
              <div class="column-wrap-start comment-user">
                <a class="nickname">{{ item.user.nickname }}</a>
                <img width="50" height="50" :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="comment-right">
                <div class="comment-center">
                  ：<span v-html="replace(item.content)"></span>
                </div>
                <!-- 回复 -->
                <div
                  v-if="item.beReplied.length != 0"
                  class="conment-beReplied"
                >
                  <div
                    class="item comment-all"
                    v-for="i in item.beReplied"
                    :key="i"
                  >
                    <div class="column-wrap comment-user">
                      <a class="nickname">{{ i.user.nickname }}</a>
                      <img
                        width="50"
                        height="50"
                        :src="i.user.avatarUrl"
                        alt=""
                      />
                    </div>
                    <div class="comment-right">
                      <div class="comment-center">
                        ：<span v-html="replace(i.content)"></span>
                      </div>
                    </div>
                  </div>
                  <div class="comment-font">
                    <!-- <span class="time info-grey">{{format(item.time)}}</span> -->
                    <!-- <div class="comment-font-1">
                                        <div>
                                            <img width="15" class="zan" alt="">
                                            <span style="color:#1296db">{{item.likedCount}}</span>
                                        </div>
                                        <div>
                                            <img width="15" class="discuss" alt="">
                                            <span style="color:#1296db">{{item.beReplied.length}}</span>
                                        </div>
                                    </div> -->
                  </div>
                </div>
                <div class="comment-font">
                  <span class="time info-grey">{{ format(item.time) }}</span>
                  <div class="comment-font-1">
                    <div>
                      <img width="15" class="zan" alt="" />
                      <span style="color: #1296db">{{ item.likedCount }}</span>
                    </div>
                    <div>
                      <img width="15" class="discuss" alt="" />
                      <span style="color: #1296db">{{
                        item.beReplied.length
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="nocomment" v-else>
          <span>暂无评论</span>
        </div>
      </div>
    </div>
    <!-- 相似mv -->
    <div class="simi">
      <div class="mv">
        <div class="items">
          <div
            class="item card"
            v-for="item in simimv"
            :key="item.id"
            @click="toMvInfo(item.id)"
          >
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <button class="play"></button>
            </div>
            <div class="mv-wrap">
              <p class="mv-name">{{ item.name }}</p>
              <p class="artist">{{ item.artistName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { checkdesc } from "../../assets/js/desc.js";
export default {
  name: "mvInfo",
  data() {
    return {
      //传入id
      id: this.$route.query.id,
      // mv信息
      mv: [],
      // 评论信息
      mvinfo: [],
      // 播放地址
      mvurl: "",
      // 头像信息
      icon: "",
      //置顶评论
      topcomments: [],
      //热门评论
      hotcomments: [],
      //全部评论
      comments: [],
      // 评论数
      total: 0,
      //相似mv
      simimv: [],
    };
  },
  created() {
    this.getMv();
    this.playMv(this.id);
    this.getComments(this.id);
    this.getSimimv(this.id);
  },
  watch: {
    // $route() {
    //   this.$router.go(0);
    // },
    mvinfo() {
      this.$nextTick(() => {
        this.checkdescbut();
      });
    },
  },
  methods: {
    //获取mv数据
    getMv() {
      axios({
        /* 说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 
                    可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 , 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
                    必选参数 : mvid: mv 的 id
                    接口地址 : /mv/detail */
        url: "https://autumnfish.cn/mv/detail",
        method: "get",
        params: {
          mvid: this.id,
        },
      }).then((res) => {
        console.log("mv.detail:" + res.data.data);
        this.mv = res.data.data;
        // 获取作者信息
        axios({
          url: "https://autumnfish.cn/artists",
          method: "get",
          params: {
            id: res.data.data.artistId,
          },
        }).then((res) => {
          console.log("artists:" + res);
          // 歌手的封面信息
          this.icon = res.data.artist.picUrl;
        });
      });
    },
    //获取mv点赞转发评论信息
    // getMvinfo(){
    //     axios({
    //         /*
    //         说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
    //         必选参数 : mvid: mv 的 id
    //         接口地址 : /mv/detail/info
    //         */
    //         url:"https://autumnfish.cn/mv/detail/info",
    //         method:'get',
    //         params:{
    //             mvid:this.id
    //         }
    //     }).then(res=>{
    //         this.mv=res.data.data
    //         console.log('info:'+res.data.data);
    //     })
    // },
    // //获取播放地址
    playMv(id) {
      axios({
        /* 
                说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
                必选参数 : id: mv id
                可选参数 : r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
                接口地址 : /mv/url
                */
        url: "https://autumnfish.cn/mv/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        this.mvurl = res.data.data.url;
      });
    },
    // 获取评论
    getComments(id) {
      axios({
        url: "https://autumnfish.cn/comment/mv",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        this.topcomments = res.data.topComments;
        this.hotcomments = res.data.hotComments;
        this.comments = res.data.comments;
        this.total = res.data.total;
      });
    },
    //相似mv
    getSimimv(mvid) {
      axios({
        url: "https://autumnfish.cn/simi/mv",
        method: "get",
        params: {
          mvid,
        },
      }).then((res) => {
        this.simimv = res.data.mvs;
      });
    },
    // 简介折叠展开
    checkdesc() {
      checkdesc();
    },
    //换行符替换
    replace(str) {
      return str.replace(/[\n]/g, "<br/>");
    },
    //时间戳计算
    format(time) {
      return this.$indexjs.format(time);
    },
    // 文本折叠
    checkdescbut() {
      let desc = document.querySelector(".desc");
      let descstyle;
      let descbut = document.querySelector(".descbut");
      if (desc.currentStyle != null) {
        descstyle = desc.currentStyle;
      } else {
        descstyle = window.getComputedStyle(desc, null);
      }
      if (parseInt(descstyle.height) <= 3 * parseInt(descstyle.lineHeight)) {
        alert(parseInt(descstyle.height));
        alert(parseInt(descstyle.height) <= 3 * parseInt(descstyle.lineHeight));
        descbut.innerHTML = "";
        alert(descbut.innerHTML);
      }
    },
    toMvInfo(id) {
      //跳转中转，再回到mv播放页面
      this.$router.push({
        path: "/transfer",
        query: {
          url:{
            path: "/mvInfo",
            query: {
              id,
            },
          },
        },
      })
    },
  },
};
</script>

<style>
</style>