<template>
    <div class="results">
        <div class="tab">
            <div class="title-warp">
                <h2 class="title">{{keywords}}</h2>
                <span class="sub-title">找到 {{count}} 个结果</span>    
            </div>
            <el-tabs v-model="activeName" >
            <el-tab-pane label="单曲" name="song">
                <el-table
                    :data="resultList"
                    style="width: 100%" 
                    @row-click="rowClick">
                    <el-table-column
                        type="index"
                        width="40">
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
                        prop="ar[0].name"
                        label="作者"
                        width="">
                    </el-table-column>
                    <el-table-column
                        prop="al.name"
                        label="专辑">
                    </el-table-column>
                    <el-table-column
                        prop="al.dt"
                        label="时长">
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <!-- <el-tab-pane label="歌手" name="playlists">
                
            </el-tab-pane> -->
            <el-tab-pane label="歌单" name="songs">
                <div class="items">
                    <div class="item" v-for="(i,index) in resultList" @click="toSongsInfo(i.id)" :style="{width:100/5-2+'%'}" :key="index">
                        <div class="img-wrap">
                            <span class="img-righttop">点击量:{{i.playCount}}</span>
                            <img :src="i.coverImgUrl" alt="">
                            <button class="play"></button>
                        </div>
                        <span class="name-wrap">{{i.name}}</span>
                    </div>
                    <p></p>
                </div>
                
            </el-tab-pane>
            <el-tab-pane label="mv"  name="mv">
                <div class="mv">
                    <div class="items">
                        <div class="item" :style="{width:100/4-2+'%'}"  v-for="(i,index) in resultList" @click="toMvInfo(i.id)" :key="index">
                            <div class="img-wrap">
                                <span class="img-righttop"><i class="el-icon-caret-right"></i> {{i.playCount}}</span>
                                <img :src="i.cover" alt="">
                                <button class="play"></button>
                            </div>
                            <div>
                                <p>{{i.name}}</p>
                                <p>{{i.artistName}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </el-tab-pane>
            </el-tabs>
        </div>
        
    </div>
</template>

<script>
import axios from 'axios';
// import Items from './list/items.vue'

export default {
    name:'result',
    // components:{
    //     Items
    // },
    created(){
        //搜素音乐
        this.searchSong();
    },
    data(){
        return{
            //传入参数
            keywords:this.$route.query.keywords,
            //搜索结果
            resultList:[],
            //搜索匹配数量
            count:0,
            //tab被选中选项，默认为单曲
            activeName:"song"
        }
    },
    watch:{
        activeName(){
            switch (this.activeName) {
                case 'song':
                    this.searchSong()
                    break;
                case 'songs':
                    this.searchSongs()
                    break;
                case "mv":
                   this.searchMv()
                    break;
                default:
                    
                    break;
            }
        }
    },
    computed:{
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
        rowClick(row, column, event){
            console.log(row, column, event);
            this.playMusic(row.id);
        },
        //简化播放量
        roundCount:(playcount)=>{
            if(playcount<=100000){
                return playcount;
            }else{
                return parseInt(playcount/10000)+'万';
            }
        },
        //播放音乐
         playMusic(id){
             this.$indexjs.playMusic(id);
        },
        searchSong(){
            //搜素单曲
            axios({
                url:'https://autumnfish.cn/cloudsearch',
                method:'get',
                params:{
                    keywords:this.keywords,
                    // limit:limit,
                    type:1
                    /* 可选
                    limit : 返回数量 , 默认为 30 
                    offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
                    type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
                    */
                }
            }).then(res=>{
                this.resultList=res.data.result.songs
                this.count=res.data.result.songCount
                for(let item of this.resultList){
                    item.al.dt=this.duration(item.dt)
                }
            })
        },
        searchSongs(){
            //搜素歌单
            axios({
                url:'https://autumnfish.cn/cloudsearch',
                method:'get',
                params:{
                    keywords:this.keywords,
                    // limit:limit,
                    type:1000
                }
            }).then(res=>{
                this.resultList=res.data.result.playlists 
                this.count = res.data.result.playlistCount  
                for(let item of this.resultList){
                    item.playCount=this.roundCount(item.playCount)
                }
            })
        },
        searchMv(){
            //搜素mv
            axios({
                url:'https://autumnfish.cn/cloudsearch',
                method:'get',
                params:{
                    keywords:this.keywords,
                    limit:20,
                    type:1004
                }
            }).then(res=>{
                this.resultList=res.data.result.mvs
                this.count = res.data.result.mvCount
                for(let item of this.resultList){
                    item.duration=this.duration(item.duration)
                    item.playCount=this.roundCount(item.playCount)
                }
            })
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
    }
}
</script>

<style>

</style>