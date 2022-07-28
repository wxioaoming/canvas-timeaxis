<template>
  <div id="app">
    <home/>
  </div>
</template>

<script>
import home from './components/home.vue'

export default {
  name: 'App',
  components: {
    home
  }
}
</script>

<style>
#app {
  width: 100vw;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-left: 50%; */
  /* width: 100vw;
  height: 100vh;
  overflow: hidden; */
}

.dplayer-notice{
  display: none;
}
.dplayer{
    width: 102vmin;
    height: 500px;
    object-fit:fill;
}
.dplayer-video-wrap .dplayer-video{
    /* width: 102vmin;
    height: 500px; */
    object-fit:fill;
}
.virtual-ruler-body{
  transform: translateX(-783px);
}
.virtual-ruler-point{
  display: none;
}
.virtual-ruler-label{
  font-size: 6px !important;
  left: -20px !important;
}
body{
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
</style>
