<template>
  <div class="myaudio">
    <audio
      ref="audio"
      id="music"
      @play="playSong()"
      @ended="$emit('setended')"
      :src="url"
      :autoplay="isautoplay"
      @loadedmetadata="loadAudiodate()"
    ></audio>
    <div class="btn-audio">
      <div class="btn-audio-info">
        <div class="btn-audio-img">
          <img :src="img !==null ? img:songImg_default" alt="" />
        </div>
        <div class="audio-auther-warp">
          <span class="songname" :title="this.songname">{{ songname }}</span
          ><br />
          <sapn class="arname" :title="this.arname">{{ arname }}</sapn>
        </div>
      </div>

      <div class="btn-audio-content">
        <div class="btns">
          <i ref="playorder" :class="playOrder" @click="playorder()"></i>
          <i class="lastsong" @click="$emit('last')"></i>
          <i
            ref="playMusic"
            :class="playMusic"
            @click="playMusic == 'playsong' ? playSong() : pauseSong()"
          ></i>
          <i class="nextsong" @click="$emit('next')"></i>
          <span class="ci"></span>
        </div>
        <span class="start">{{ start }}</span>
        <div ref="container" class="container" @click="checkClick">
          <div class="now" ref="now"></div>
        </div>
        <span class="end">{{ end }}</span>
      </div>
      <div class="btn-audio-right">
        <div
          class="btn-volume"
          @mouseenter="hoverVolume()"
          @mouseout="mouseoutVolume()"
        >
          <div ref="volumebackground" class="volume-background">
            <div ref="volume" class="volume-container" @click="checkVolume">
              <div ref="volumenow" class="volume-now"></div>
            </div>
          </div>
          
          <i :class="voice" @click="mute()"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

// import { computed } from 'vue';
export default {
  name: "myaudio",
  props: {
    url: {
      type: String,
    },
    img: {
      type: String,
    },
    songname: {
      type: String,
    },
    arname: {
      type: String,
    },
    isautoplay: {
      type: String,
    },
  },
  // emits:["update:img"],
  data() {
    return {
      start: "00:00",
      end: "00:00",
      songImg_default:require("../../assets/img/default_album.jpg"),
      // 当前播放位置
      currenttime: "",
      // 播放顺序
      playOrder: "order",
      // 播放/暂停
      playMusic: "playsong",
      // 音量
      volume: 1,
      // 静音/未静音，
      voice: "volume",
    };
  },
  // const dialogImg=computed({
  //   get :()=>props.img,
  //   set:(val)=>{context.emit("upadate:img",val)}
  // }),
  created() {},
  watch: {
    url: function () {
      if (this.isautoplay == "autoplay") {
        this.playSong();
      }
      if (this.url == "") {
        this.clearPlay();
      }
    },
  },
  methods: {
    // 播放顺序
    playorder() {
      switch (this.playOrder) {
        case "order":
          this.playOrder = "random";
          break;
        case "random":
          this.playOrder = "loop";
          break;
        case "loop":
          this.playOrder = "order";
          break;

        default:
          break;
      }
    },
    // 播放音乐
    playSong() {
      let now = this.$refs.now;
      let audio = this.$refs.audio;
      // console.log(this.url);
      this.playMusic = "pausesong";
      audio.play();
      this.currenttime = setInterval(() => {
        this.start = this.conversion(audio.currentTime);
        now.style.width =
          (audio.currentTime / audio.duration.toFixed(3)) * 100 + "%";
      }, 1000);
    },
    // 暂停
    pauseSong() {
      let audio = this.$refs.audio;

      this.playMusic = "playsong";
      audio.pause();
      clearInterval(this.currenttime);
    },
    // 点击进度条
    checkClick: function (e) {
      let now = this.$refs.now;
      let audio = this.$refs.audio;
      let container = this.$refs.container;

      let coordStart = container.getBoundingClientRect().left;
      let coordEnd = e.pageX;
      let p = (coordEnd - coordStart) / container.offsetWidth;
      now.style.width = p.toFixed(3) * 100 + "%";

      audio.currentTime = p * audio.duration;
      this.playSong();
    },
    // 计算播放时间
    conversion(value) {
      let minute = Math.floor(value / 60);
      minute = minute.toString().length === 1 ? "0" + minute : minute;
      let second = Math.floor(value % 60);
      second = second.toString().length === 1 ? "0" + second : second;
      return `${minute}:${second}`;
    },
    // 设置播放时间
    loadAudiodate() {
      let audio = this.$refs.audio;
      this.end = this.conversion(audio.duration);
      this.start = this.conversion(audio.currentTime);
    },
    // 清空播放数据
    clearPlay() {
      this.start = "00:00";
      this.end = "00:00";
      this.songImg_default = require("../../assets/img/default_album.jpg");
      this.$refs.now.style.width = 0;
      this.pauseSong();
    },
    // 静音/取消静音
    mute() {
      let audio = this.$refs.audio;
      let now = this.$refs.volumenow;
      if (audio.volume == 0) {
        audio.volume = this.volume;
        now.style.height = this.volume * 100 + "100%";
        this.voice = "volume";
      } else {
        audio.volume = 0;
        now.style.height = "0";
        this.voice = "mute";
      }
    },
    // 点击进度条
    checkVolume: function (e) {
      let now = this.$refs.volumenow;
      let audio = this.$refs.audio;
      let container = this.$refs.volume;

      let coordStart = container.getBoundingClientRect().bottom;
      let coordEnd = e.pageY;
      let p = (coordStart - coordEnd) / container.offsetHeight;
      now.style.height = p.toFixed(3) * 100 + "%";

      audio.volume = p.toFixed(3);
      this.volume = p.toFixed(3);
    },
    hoverVolume() {
      clearTimeout();
      this.$refs.volumebackground.style.display = "block";
      // setTimeout(()=>{
      //     // this.$refs.volume.style.display="none"
      // },2000)
    },
    mouseoutVolume() {
      setTimeout(() => {
        this.$refs.volumebackground.style.display = "none";
      }, 2500);
    },
  },
};
</script>

<style scope>
@import "../../assets/css/audio.css";
</style>>