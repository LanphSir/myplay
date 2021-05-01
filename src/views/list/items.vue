<template>
  <div class="items">
      <div class="item" :style="{width:100/column-2+'%'}" >
          <!-- <span>{{item.name}}</span>
          <img :src="item.cover" alt="">
          <p></p>
          <button class="play"></button> -->
      </div>
  </div>
</template>

<script>
export default {
    name:'items',
    props:{
        // songs:Array,
        column:{
            type:Number,
            default:5
        }
    },
    data(){
        return{
            testlist:[
                {id:"1",name:"a",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"2",name:"b",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"3",name:"c",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"4",name:"d",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"5",name:"e",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"6",name:"f",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"7",name:"a",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"8",name:"a",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"9",name:"a",picUrl:" https://api.dujin.org/bing/1366.php"},
                {id:"10",name:"a",picUrl:" https://api.dujin.org/bing/1366.php"},
            ],
            // num:this.column
        }
    },
    computed:{
        itemWidth(column){
            return 100/column;
        }
    }
}
</script>

<style>
    .items>.item{
        margin: 1%;
    }
    .items>.item img{
        width: 100%;
        height: auto;
    }
    .items>.item span{
        /* width: 100%; */
        white-space: nowrap; /* 文本强制不换行； */
        text-overflow:ellipsis; /* 文本溢出显示省略号； */
        overflow:hidden; /* 溢出的部分隐藏； */
    }
</style>