<template>
  <div class="songslist">
      <!-- 精品歌单 -->
      <div class="topsongs row-wrap-start" @click="toSongsInfo(toplist.id)">
          <div>
              <img :src="toplist.coverImgUrl" alt="">
          </div>
          <div class="content-wrap">
              <span class="quality">精品歌单推荐</span><br/>
              <span class="title">{{toplist.name}}</span>
              <div class="info">
                {{ toplist.description }}
              </div>
          </div>
      </div>
      <!-- 标签 -->
      <ul class="hottags">
        <li :class="{active:tag==='全部'}" @click="tagChange('全部')">全部</li>
        <li v-for="item in tags" :key="item.id" :class="{active:tag==item.name}" @click="tagChange(item.name)">
            {{item.name}}
        </li>
      </ul>
      <!-- 热门歌单 -->
      <div class="songs">
          <div class="items">
            <div class="item" v-for="(i,index) in playlist" @click="toSongsInfo(i.id)" :style="{width:100/5-2+'%'}" :key="index">
                <div class="img-wrap">
                    <span class="img-righttop">点击量:{{roundCount(i.playCount)}}</span>
                    <img :src="i.coverImgUrl" alt="">
                    <button class="play"></button>
                </div>
                <span class="name-wrap">{{i.name}}</span>
            </div>
            <p></p>
        </div>
      </div>
      <!-- 
          分页条
          total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change 页码改变事件
       -->
       <center>
        <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="prev, pager, next"
            :current-page="page"
            :page-size="pagesize"
            :total="total">
        </el-pagination>
       </center>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    name:'songslist',
    data(){
        return{
            //获取的标签
            tags:[],
            //热门歌单
            playlist:[],
            //当前标签
            tag:'全部',
            //推荐歌单
            toplist:[],
            //总条数
            total:0 ,
            //页码
            page:1,
            //单页数量
            pagesize:10,
        }
    },
    created(){
        this.getTags(),
        this.getPlaylist(),
        this.topData()
    },
    methods:{
        //获取热门歌单标签
        getTags(){
            axios({
                url:"https://autumnfish.cn/playlist/hot",
                method:'get'
            }).then(res=>{
                this.tags=res.data.tags
            })
        },
        //精品歌单
        topData() {
            axios({
            url: 'https://autumnfish.cn/top/playlist/highquality',
            method: 'get',
            params: {
                limit: 1,
                cat: this.tag
            }
            }).then(res => {
            // console.log(res)
            this.toplist = res.data.playlists[0]
            })
        },
        getPlaylist(tag){
            //获取精品歌单
            /* 
            可选参数 :  order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
                    cat: cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
                    limit: 取出歌单数量 , 默认为 50
                    offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*50, 其中 50 为 limit 的值
            */
            axios({
                url:"https://autumnfish.cn/top/playlist",
                method:'get',
                params:{
                    limit: this.pagesize,
                    cat:tag,
                    // 起始的值 （页码-1）*每页多少条数据
                    offset: (this.page - 1) * this.pagesize,
                }
            }).then(res=>{
                this.total = res.data.total
                this.playlist= res.data.playlists
            })
        },
        //跳转到歌单详细信息页面
        toSongsInfo(id){
            this.$router.push({
                path:'/songsInfo',
                query:{
                    id
                }
            })
        },
        //简化播放量
        roundCount:(playcount)=>{
            if(playcount<=100000){
                return playcount;
            }else{
                return parseInt(playcount/10000)+'万';
            }
        },
        //标签点击事件
        tagChange(tag){
            if(this.tag!=tag){
                this.tag=tag
                this.getPlaylist(tag)
            }
        },
        // 页码改变事件
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`)
            // 保存页码
            this.page = val
            // 重新获取数据
            this.getPlaylist(this.tag)
        }
    }
}
</script>

<style>

</style>