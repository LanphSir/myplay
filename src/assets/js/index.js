// 全局js
// import axios from 'axios'
export default {
    playMusic(id){
            window.$Bus.$emit('musicId',id);
            window.$Bus.$emit('isAutoplay','autoplay');
    },
    // 时间戳转换
    format(time){
        var date=new Date(parseInt(time)* 1000);
        var Y=date.getFullYear();
        var M=date.getMonth()+1;
        var D=date.getDate();
        return Y+'-'+M+'-'+D;
    },
    // 点击任意区域隐藏
    clickDocument(dom){
        // let dom=this.$refs.searchlist
        document.onclick=function(){
            dom.style.display="none"
        }
    },
    // 设置未加载或加载错误时图片
    // defaultImg(dom,img){
    //     dom.onerror=function(){
    //         dom.src=img
    //         // 防止闪图
    //         dom.onerror=null
    //     }
    // }
    // 中转
   
}
