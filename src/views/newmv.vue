<template>
  <div class="newmv">
      <div>
        <div class="filter-row">
          <span>地区：</span>
          <ul class="areas">
            <li v-for="item in areas" :key="item" class="title" :class="{active:area==item}" @click="area=item">{{item}}</li>
          </ul>
        </div>
        <div class="filter-row">
          <span>类型：</span>
          <ul class="types">
            <li v-for="item in types" :key="item" class="title" :class="{active:type==item}" @click="type=item">{{item}}</li>
          </ul>
        </div>
        <div class="filter-row">
          <span>排序：</span>
          <ul class="orders">
            <li v-for="item in orders" :key="item" class="title" :class="{active:order==item}" @click="order=item">{{item}}</li>
        </ul>
        </div>
      </div>
      <div class="mv">
        <div class="items">
            <div class="item" v-for="(item,index) in mvlist" :style="{width:100/4-2+'%'}" :key="index" @click="toMvInfo(item.id)">
                <div class="img-wrap">
                  <span class="img-righttop"><i class="el-icon-caret-right"></i> {{roundCount(item.playCount)}}</span>
                    <img :src="item.cover" alt="">
                    <button class="play"></button>
                </div>
                <div class="mv-wrap">
                    <p class="song-name">{{item.name}}</p>
                    <p class="singer">{{item.artistName}}</p>
                </div>
            </div>
        </div>
        <center>
          <el-pagination
              background
              @current-change="handleCurrentChange"
              layout="prev, pager, next"
              :current-page="page"
              :page-size="limit"
              :total="total">
          </el-pagination>
       </center>
      </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name:"newmv",
  data(){
    return{
      //获取的mv
      mvlist:[],
      //可选地区
      areas:["全部","内地","港台","欧美","日本","韩国"],
       //选择地区
      area:"全部",
      //可选类型
      types:["全部","官方版","原生","现场版","网易出品"],
      //类型
      type:"全部",
      //可选排序方式
      orders:["上升最快","最热","最新"],
      //排序方式
       order:"上升最快",
      //取出数量
      limit:8,
      //总条数
      total:0 ,
      //页码
      page:1,
    }
  },
  created(){
    this.getMvlist()
  },
  watch:{
    area(){
      this.getMvlist()
    },
    type(){
      this.getMvlist()
    },
    order(){
      this.getMvlist()
    },
  }
  ,
  methods:{
    //获取所有mv
    getMvlist(){
      axios({
      /*   可选参数 :
        area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部 
        type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
        order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
        limit: 取出数量 , 默认为 30
        offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
        接口地址 : /mv/all
         */
        url:"https://autumnfish.cn/mv/all",
        method:'get',
        params:{
          area:this.area,
          type:this.type,
          order:this.order,
          limit:this.limit,
          offset:(this.page-1)*this.limit
        }
      }).then(res=>{
        this.mvlist=res.data.data
        console.log(res.data.data);
        //接口问题 有count就赋值
        if(res.data.count){
          this.total=res.data.count;
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
    // 页码改变事件
    handleCurrentChange(val) {
        // console.log(`当前页: ${val}`)
        // 保存页码
        this.page = val
        // 重新获取数据
        this.getMvlist()
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