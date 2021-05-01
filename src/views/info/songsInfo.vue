<template>
<!-- 歌单详情 -->
  <div class="songsInfo">
      <div  class="creator row-wrap-start">
          <div class="img-wrap">
              <img :src="playlist.coverImgUrl" alt="" width="230">
              <button class="svg-like"></button>
          </div>
          <div class="right-wrap">
            <span>{{playlist.name}}</span>
            <div class="auther-wrap">
                <img class="img-round" :src="playlist.creator.avatarUrl" alt="" width="36">
                <span class="auther">{{playlist.creator.nickname}}</span>
                <span> {{format(playlist.createTime)}} 创建</span>
            </div>
            <div class="tags-wrap">
                标签：
                <button class="tag" v-for="item in playlist.tags" :key="item">
                    {{item}}
                </button>
            </div>
            <div class="">
                <p class="desc">
                    简介：<span v-html="replace(playlist.description)"></span>
                </p>
                <a href="#" class="descbut" @click="checkdesc()">展开</a>
            </div>
          </div>
      </div>
      <div class="" style="background-color: transparent;">
        <el-table
        :data="playlist.tracks"
        style="width: 100%" 
        @row-click="rowClick">
            <el-table-column
                type="index"
                width="40">
            </el-table-column>
            <el-table-column
                label=""
                width="100">
                <template slot-scope="scope">
                    <el-image :src="scope.row.al.picUrl" lazy>
                        <!-- <img :src="scope.row.al.picUrl" width="50" alt=""> -->
                        <div slot="error" class="image-slot">
                            <i class="el-icon-picture-outline"></i>
                        </div>
                        <!-- <button class="play"></button> -->
                        <div slot="placeholder" class="image-slot" style="height:80px;">
                            加载中<span class="dot">...</span>
                        </div>
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column
                label="音乐名"
                width="">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.name }}</span>
                    <i style="color:red;margin-left:5px;" v-if="(scope.row.mv)!=0" class="el-icon-video-play" @click.stop="toMvInfo(scope.row.mv)"></i>
                </template>
            </el-table-column>
            <el-table-column
                label="作者"
                width="">
                <template slot-scope="scope">
                    <span style="margin-left: 10px">{{ scope.row.ar[0].name }}</span>
                    <span v-if="scope.row.alia.length!=0" style="color:#aaa;margin-left:5px;">{{scope.row.alia}}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="al.name"
                label="专辑">
            </el-table-column>
            <el-table-column
                prop="dt"
                label="时长">
                <template slot-scope="scope">
                    <span>{{duration(scope.row.dt)}}</span>
                </template>
            </el-table-column>
        </el-table>
      </div>
      
  </div>
</template>

<script>
import axios from 'axios';
import {checkdesc} from '../../assets/js/desc.js'
export default {
    name:'songsInfo',
    created(){
        this.searchSongs()
    },
    data(){
        return {
            id:this.$route.query.id,
            // 显示列表
            playlist:[],
        }
    },
    methods:{
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
        //行点击事件
        rowClick(row, column, event){
            console.log(row, column, event);
            this.playMusic(row.id);
        },
        //时间戳计算
        format(time){
            return this.$indexjs.format(time);
        },
        //换行符替换
        replace(str){
            return str.replace(/[\n]/g, "<br/>")
        },
        //播放音乐
        playMusic(id){
            this.$indexjs.playMusic(id);
        },
        // 搜索歌单
        searchSongs(){
            axios({
                url: "https://autumnfish.cn/playlist/detail",
                method: "get",
                params: {
                    id:this.id
                }
            }).then(res=>{
                this.playlist=res.data.playlist
            });
        },
        // 简介折叠展开
        checkdesc(){
            checkdesc();
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