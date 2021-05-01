<template>
  <div class="discovery">
    <div class="lbt">
        <el-carousel :interval="4000" type="card">
            <el-carousel-item v-for="(item, index) in banners" :key="index">
                <img :src="item.imageUrl" alt=""/>
            </el-carousel-item>
        </el-carousel>
    </div>
    <div class="playlist">
        <h3>
            推荐歌单
        </h3>
        <div class="items">
            <div class="item" v-for="(item , index) in list" :style="{width:100/5-2+'%'}" :key="index" @click="toSongsInfo(item.id)">
                <div class="img-wrap">
                    <span class="img-lefttop">{{item.copywriter}}</span>
                    <img :src="item.picUrl" alt="">
                    <button class="play"></button>
                </div>
                <p class="name">{{item.name}}</p>   
            </div>
        </div>
    </div>
    <div class="newsong">
        <h3>推荐新音乐</h3>
        <div class="items">
            <div class="item" v-for="(item , index) in newsong" :style="{width:100/2-2+'%'}"  @click="playMusic(item.id)" :key="index">
                <div class="img-wrap">
                    <img :src="item.picUrl" alt="">
                    <button class="play"></button>
                </div>
                <div class="column-wrap">
                    <p class="song-name">{{item.name}}</p>
                    <p class="singer">{{item.song.artists[0].name}}</p>
                </div>
                
            </div>
        </div>  
    </div>
    <div class="mv">
    <h3>推荐mv</h3>
        <div class="items">
            <div class="item" v-for="(item,index) in mv" :style="{width:100/4-2+'%'}" :key="index" @click="toMvInfo(item.id)">
                <div class="img-wrap">
                    <img :src="item.picUrl" alt="" ref="mvDefauleimg">
                    <button class="play"></button>
                </div>
                 <div class="mv-wrap">
                    <p class="song-name">{{item.name}}</p>
                    <p class="singer">{{item.artistName}}</p>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from'axios'
export default {
    name:'discovery',
    data(){
        return{
            //轮播图
            banners:[],
            //推荐歌单
            list:[],
            //新音乐推荐
            newsong:[],
            //推荐mv
            mv:[]
        }
    },
    created() {
        //获取轮播图
        axios({
            url:'https://autumnfish.cn/banner',
            method:'get'
        }).then(res => {
            this.banners=res.data.banners;
            console.log("banners:"+this.banners);
        }),
        //获取推荐歌单
        /**
         * 推荐歌单
         * 说明 : 调用此接口 , 可获取推荐歌单
         *   可选参数 : limit: 取出数量 , 默认为 30 (不支持 offset)
         *   接口地址 : /personalized
         *   调用例子 : /personalized?limit=1 
         */
        axios({
            url:'https://autumnfish.cn/personalized',
            method:'get',
            params: {
            // 获取的数据量
            limit: 10
            }
        }).then(res=>{
            this.list=res.data.result;
            console.log("list"+this.list);
        }),
        /**
         * 推新音乐
         * 说明 : 调用此接口 , 可获取推荐新音乐
         *   可选参数 : limit: 取出数量 , 默认为 10 (不支持 offset)
         *   接口地址 : /personalized
         *   调用例子 : /personalized/newsong
         */
        axios({
            url:'https://autumnfish.cn/personalized/newsong',
            method:'get',
            params:{
                limit:10
            }
        }).then(res=>{
            this.newsong=res.data.result;
            console.log("newsong:"+this.newsong);
        })
        /**
         * 推荐mv
         * 说明 : 调用此接口 , 可获取推荐mv
         *   接口地址 : /personalized
         *   调用例子 : /personalized/mv
         */
        axios({
            url:'https://autumnfish.cn/personalized/mv',
            method:'get'
        }).then(res=>{
            this.mv=res.data.result;
            console.log("mv:"+this.mv);
        })
    },
    mounted(){
        // this.setDefaultimg()
    },
    methods:{
        //播放音乐
        playMusic(id){
            this.$indexjs.playMusic(id);
        },
        toSongsInfo(id){
            //跳转到歌单详细信息页面
            this.$router.push({
                path:'/songsInfo',
                query:{
                    id
                }
            })
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
        setDefaultimg(){
            // this.$indexjs.defaultImg(this.$refs.mvDefauleimg,require('../assets/img/default.png'));
        },
    },
    
}
</script>

<style>
    
</style>