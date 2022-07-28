<template>
  <div class="time_con">
    <div class="video_fl">
      <div class="play-root" ref="dplayers"></div>
      <video class="video_url" :src="videoUrl" muted autoplay controls ref="Bigvideo">  
        <!-- <source src="../assets/11.mp4" type="video/mp4"> -->
      </video>
    </div>

    <div>
      <button @click="TimeS('1')">后一天</button>
       {{endValue}}
      <button @click="TimeS('2')">前一天</button>
    </div>

    <div>{{conste}}</div>

    <div>
      <button @click="screen()">筛选</button>
    </div>
    
     <div class="canvas_fl"
     ref="canvasf"
     @click="dblclickFunc" 
     @mousedown="mousedownFunc" 
     @mouseout="mouseoutFunc">
      <canvas ref="canvas" id="timeline" width="1500" height="90" style="cursor: pointer;background-color: #2b2f33;" ></canvas>
    </div>

    <!-- 列表视频选择 -->
    <div v-if="ListVideoShow == true">

      <span v-for="(item,index) in defDataList" :key="index" class="defDl_fl">
        <!-- {{item.url}} -->
        <span v-if="item.url.length > 0">
          <!-- <span>{{item.time}}:00</span> -->
          <span class="defdl_text">{{item.time}}:00</span>
          <!-- <video class="video_url_card" v-for="(item1,index1) in item.url" :src="item1" @click="reVio('1',item1,index1)"></video> -->

          <video class="video_url_card" :src="item.url[0]" @click="reVio('1',item.url)"></video>
        </span>
      </span>
    </div>

    <div v-if="ListVideoShow == false" class="listShow">
      <div>
        <i class="el-icon-arrow-left icons" @click="reVio('2')"></i>
        列表
      </div>
      <div class="viderlist"> 
        <span v-for="(item,index) in videoLists" :key="index" class="videoItem">
          <span class="duration_text">"{{item.duration}}"</span>
          <video :src="item.url" :class="setVC(numVideoIndex,index,item.url)" ref="videourls" @click="reVio('3',item.url,index)"></video>          
          <!-- <video :src="item.url" :class="setVC(numVideoIndex,index)" ref="videourls" @click="reVio('3',item.url,index)"></video> -->
        </span>
      </div>
    </div>


    <!-- <div class="viderlist_codk"> 
      <span v-for="(item,index) in videoList" :key="index" class="videoItem">
        <video :src="item.url" class="video_play" ref="codkvideo"></video>
      </span>
    </div> -->

    <el-dialog
      title="列表"
      :visible.sync="dialogVisible"
      :before-close="handleClose">
      <div v-if="isshow == 16"></div>

      <div v-if="isshow == 1">
        <selector :key="timer"/>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import selector from 'views/LazyFiltering/timeSelector'
import DPlayer from 'dplayer'
import { request } from '../network/request'
// import {getBackupTimeline} from "@/plugins/axios";
export default {
  data() {
    return {
      // startValue: this.$moment().format("YYYY-MM-DD"),//开始时间---时间选择
      endValue: this.$moment().format("YYYY-MM-DD"),//结束时间---时间选择
      isshow:1,
      videoUrl:'http://192.168.26.150:8012/static/test2.mp4',
      conste:'视频总数',
      dialogVisible:false,
      timer:'',
      ListVideoShow:true,
      palyblock:true,
      getdplayers:null,
      numVideoIndex:null,
      timeNum:0,
      canvas:null,ctx:null,isstatic:true,timest:'',
      canvansW:null,canVansH:null,defnums:1,isdunums:1,
      minutes_per_step:[0.015,0.2,0.5,1,5,10,15,20,30, 60, 120, 180, 240, 360, 720, 1440],
      // minutes_per_step:[0.05,0.5,1,2,5,10,13,15,20,25],
      graduation_step:16,hours_per_ruler:24,
      start_timestamp:new Date().getTime() - 12*60*60*1000,
      distance_between_gtitle:80,zoom:24,
      g_isMousedown:false,g_isMousemove:false,g_mousedownCursor:null,returnTime:null,
      event:null,pre:0,poTime:null,Pxt:0,defPrx:null,
      defDataList:[],
      videoLists:[],ismousemove:true,
      timecell:[
        {
          beginTime:new Date().getTime() - 5000000,
          endTime:new Date().getTime() -5000000 +  340 * 1000,
          url:"http://192.168.26.150:8012/static/test2.mp4",
          text:'事件1',
          filterList:[
            {
              beginTime:new Date().getTime() - 5000000,
              endTime:new Date().getTime() - 5000000 + 120 * 1000,
              background:"rgba(221, 116, 48,0.5)",
            },
            {
              beginTime:new Date().getTime() - 5000000,
              endTime:new Date().getTime() - 5000000 + 50 * 1000,
              background:"rgba(147, 95, 88,1)"
            },
            {
              beginTime:new Date().getTime() - 5000000,
              endTime:new Date().getTime() - 5000000 + 70 * 1000,
              background:"rgba(255, 0, 45,1)"
            },
            {
              beginTime:new Date().getTime() - 5000000,
              endTime:new Date().getTime() - 5000000 + 80 * 1000,
              background:"rgba(18, 134, 244,1)"
            }
          ]
        },
        {
          beginTime:new Date().getTime() - 800000,
          endTime:new Date().getTime() - 800000 + 9 * 1000,
          url:"http://192.168.31.83/dist_video/2022-06-23/find_miku10024_1655978031.1928947.mp4?t=16589087031",
          text:'事件2',
          filterList:[
            {
              beginTime:new Date().getTime() - 800000,
              endTime:new Date().getTime() - 800000 + 1 * 1000,
              background:"rgba(221, 116, 48,0.5)"
            },
            {
              beginTime:new Date().getTime() - 800000,
              endTime:new Date().getTime() - 800000 + 5 * 1000,
              background:"rgba(147, 95, 88,1)"
            }
          ]
        },
        {
          beginTime:new Date().getTime()- 750000,
          endTime:new Date().getTime() - 750000 + 600 * 1000,
          url:"http://192.168.26.150:8012/static/test.mp4",
          text:'事件3',
          filterList:[
            {
              beginTime:new Date().getTime() - 750000,
              endTime:new Date().getTime() - 750000 + 60 * 1000,
              background:"rgba(221, 116, 48,0.5)"
            },
            {
              beginTime:new Date().getTime() - 750000,
              endTime:new Date().getTime() - 750000 + 61 * 1000 + 120 * 1000,
              background:"rgba(147, 95, 88,1)"
            }
          ]
        },
        {
          beginTime:new Date().getTime() + 4299000,
          endTime:new Date().getTime() + 4299000 + 244 * 1000,
          url:"http://192.168.26.150:8012/static/test1.mp4",
          text:'事件4',
          filterList:[
            {
              beginTime:new Date().getTime() + 4299000,
              endTime:new Date().getTime() + 4299000 + 60 * 1000,
              background:"rgba(221, 116, 48,0.5)"
            },
            {
              beginTime:new Date().getTime() + 4299000,
              endTime:new Date().getTime() + 4299000 + 120 * 1000 + 80 * 1000,
              background:"rgba(147, 95, 88,1)"
            }
          ]
        },
        {
          beginTime:new Date().getTime() + 7299000,
          endTime:new Date().getTime() + 7299000 + 326 * 1000,
          url:"http://192.168.26.150:8012/static/test3.mp4",
          text:'事件5',
          filterList:[
            {
              beginTime:new Date().getTime() + 7299000,
              endTime:new Date().getTime() + 7299000 + 60 * 1000,
              background:"rgba(221, 116, 48,0.5)"
            },
            {
              beginTime:new Date().getTime() + 7299000,
              endTime:new Date().getTime() + 7299000 + 120 * 1000 + 80 * 1000,
              background:"rgba(147, 95, 88,1)"
            }
          ]
        }
      ],

      dpTime:null,isplay:false,
      myonum:0,statics:true
    };
  },
  components:{
    selector,
    request,
  },
  
  created(){
    const self = this

    for (let i = 0; i <= 23; i++) {
      let ti = i < 10 ? '0' + i : i
      self.defDataList.push({'time':String(ti),'url':[]})  
    }
    
    for(let k = 0;k <self.timecell.length;k++){
      self.timecell[k]['timeSlot'] = new Date(self.timecell[k].beginTime).getHours()      
    }

    self.timeNum = 0
    self.getTimeDate()
  },
  mounted () {
    const self = this
    self.canvas = this.$refs.canvas;
    self.ctx = self.canvas.getContext("2d");
    self.canvansW = self.canvas.width;
    self.canVansH = self.canvas.height;

    self.init(self.start_timestamp,self.timecell,self.defnums - 1);

    self.getdplayers = new DPlayer({
        container:this.$refs.dplayers,
        autoplay: false,
        preload: 'auto',
        hotkey: true,
        video:{
          url:self.videoUrl
        }
     })

    self.getdplayers.on('play', function () {
      self.setTimeData()
    })

    self.getdplayers.on('canplay', function () {      
      // console.log('self.getdplayers===',self.getdplayers);
      
      let defN = self.getdplayers.video.currentTime
      if(self.isplay == false){
        if(self.dpTime != null){
          self.clearCanvas();
          let bb =  Math.round(defN) 
          let aa =  Math.round(self.dpTime) 
          let cc = bb - aa
          if(Math.sign(self.dpTime - defN) == -1){
            let oi =  Math.round(cc) 
            // console.log('self.dpTime - defN====', Math.round(cc) );
            self.start_timestamp = self.start_timestamp + oi * 1000
            self.dpTime = bb
          }else{
            let io =  Math.round(cc) 
            // console.log('正数',);
            self.start_timestamp = self.start_timestamp + io * 1000
            // console.log('self.start_timestamp===',);
            self.dpTime = bb
          }
          if(self.isdunums == 1){
            self.init(self.start_timestamp,self.timecell,self.defnums - 1);
          }else{
            self.init(self.start_timestamp,self.timecell);
          }
        }else{
          self.dpTime = Math.round(defN)
        }
      }else{
        self.dpTime = Math.round(defN)
      }

    })

    self.getdplayers.on('pause', function () {
      clearInterval(self.timest)
    })

    self.getdplayers.on('ended', function () {
      if(self.defnums < self.timecell.length - 1){
        self.defnums += 1
        self.getdplayers.switchVideo({
          url:self.timecell[self.defnums].url
        })
        self.videoUrl = self.timecell[self.defnums].url

        self.clearCanvas();
        
        self.start_timestamp = self.timecell[self.defnums].beginTime - (self.hours_per_ruler * 3600 * 1000)/2 

        self.init(self.start_timestamp,self.timecell)

        self.getdplayers.play()
        self.isplay = true
        self.codTime()
        
      }else{
        self.isplay = false
        
        self.getdplayers.pause()
        clearInterval(self.timest)
      }

    });
    
    self.returnTime = self.start_timestamp
    self.fooList()

    // console.log('self.defDataList===',self.defDataList);
  },

  methods: {
    TimeS(){

    },

    getTimeDate(){
      const self = this

      for(let i = 0;i<self.defDataList.length;i++){
        if(self.timecell[self.timeNum].timeSlot == self.defDataList[i].time){
          self.defDataList[i].url.push(self.timecell[self.timeNum].url)
        }
      }

      self.timeNum += 1
      if(self.timeNum <= self.timecell.length - 1){
        self.getTimeDate()
      }

    },

    //筛选类型、日期、列表视频
    screen(){
      const self = this
      self.dialogVisible = true
      self.isshow = 1
      self.timer = new Date().getTime()
    },

    //点击样式
    setVC(index,i,url){
      const self = this

      if(url == self.videoUrl){
        return 'video_play_bor video_play'
      }else{
        return 'video_play'
      }
    },

    //关闭弹窗
    handleClose(done){
      done();
    },

    formateTime(time) {
      
      const h = parseInt(((time / 3600) * 100) /100).toFixed(0)
      const minute = parseInt(((time / 60 % 60) * 100) /100).toFixed(0)
      // const h = parseInt(time / 3600)
      // const minute = parseInt(time / 60 % 60)
      const second = Math.ceil(time % 60)    
 
      const hours = h < 10 ? '0' + h : h
      const formatSecond = second > 59 ? 59 : second

      return `${hours > 0 ? `${hours}:` : ''}${minute < 10 ? '0' + minute : minute}:${formatSecond < 10 ? '0' + formatSecond : formatSecond}`
    },

    timestampToTime(timestamp) {
      const date = new Date(timestamp) // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
      // let Y = `${date.getFullYear()}-`
      // let M = `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-`
      // let D = `${date.getDate()} `
      const h = `${date.getHours()}:`
      const m = `${date.getMinutes()}`
      if(m < 10){
        return h + '0' + m
      }
      // s = date.getSeconds()
      return h + m
    },

    //更换视频
    reVio(num,Url,index){
      const self = this
      // self.dialogVisible = true
      // self.isshow = 16
      
      if(num == '1'){
        self.videoLists = []

        Url.map(m=>{
          self.videoLists.push({"url":m,"duration":'',"minute":''})
        })

        self.ListVideoShow = false

        // setTimeout(()=>{
        //   for(let i=0;i<this.$refs.videourls.length;i++){
        //     const Dura = this.$refs.videourls[i].duration
        //     self.timecell[i].duration = self.formateTime(Dura)
        //   }
        // },200)

        setTimeout(()=>{
          self.videoLists.map((m,i)=>{
            const Dura = Math.round(this.$refs.videourls[i].duration)
            m.duration = self.formateTime(Dura)
            // if(isNaN(m.duration)){
            //   m.duration 
            // }else{

            // }
          })
        },500)

      }
      
      if(num == '2'){
        self.ListVideoShow = true
      }

      if(num == '3'){
        self.isdunums = 2
        self.palyblock = false
        self.numVideoIndex = index

        self.clearCanvas();

        self.defnums = index
        
        self.isplay = true
        self.getdplayers.switchVideo({
          url:Url
        })

        self.videoUrl = Url

        self.codTime()
        for(let i=0;i<self.timecell.length;i++){
          if(Url == self.timecell[i].url){
           self.start_timestamp = self.timecell[i].beginTime - (self.hours_per_ruler * 3600 * 1000)/2
           self.defnums = i
          }
        }
        
        self.pre = self.start_timestamp

        self.init(self.start_timestamp,self.timecell)

        self.getdplayers.play()
        
        self.setTimeData()
      }

    },

    codTime(){
      const self = this
      setTimeout(()=>{self.isplay = false},300)
      
    },

    init(start_timestamp,timecell,setText){
      const self = this
      let canvansW = self.canvansW,
      canVansH = self.canVansH;

      self.drawCellBg();
      self.add_graduations(start_timestamp);
      self.add_cells(timecell);  //录像颜色段
      // self.filterBg(timecell);           //录像分类块
      self.drawLine(0,canVansH,canvansW,canVansH,"rgb(151, 158, 167)",1); //底线
      self.drawLine(canvansW/2,0,canvansW/2,45,"rgb(64, 196, 255",2);     //中间播放点时间线
      self.add_events();
      var time = start_timestamp + (self.hours_per_ruler*3600*1000)/2;
      self.ctx.fillStyle = "rgba(64, 191, 248,1)"                         //设置字体颜色
      self.ctx.fillText(self.changeTime(time),canvansW/2-50,65);          //日期时间
      
      if(setText != undefined){
        // console.log('a*-*-*-**-*-**-====',setText);
        self.ctx.fillText(timecell[setText].text,canvansW/2,75);
      }else{
          // console.log("timecell[self.defnums]===",timecell[self.defnums]);
        // self.ctx.fillText(timecell[self.defnums].text,canvansW/2,75);
      }

    },

    add_graduations(start_timestamp){
      const self = this
      let canvansW = self.canvansW,
      hours_per_ruler = self.hours_per_ruler,
      graduation_step = self.graduation_step,
      minutes_per_step = self.minutes_per_step,
      distance_between_gtitle = self.distance_between_gtitle;


      var px_per_min = canvansW / (hours_per_ruler * 60); // px/min
      var px_per_ms = canvansW / (hours_per_ruler * 60 * 60 * 1000); // px/ms
      var px_per_step = graduation_step;  // px/格 默认最小值20px
      var min_per_step = px_per_step / px_per_min; // min/格
      // console.log('px_per_step====',px_per_step);
      // console.log('minutes_per_step===',minutes_per_step);
      for(var i = 0; i < minutes_per_step.length;i++){ 
          if(min_per_step <= minutes_per_step[i]){ //让每格时间在minutes_per_step规定的范围内
              min_per_step = minutes_per_step[i]; 
              px_per_step = px_per_min * min_per_step;
              break
          }
      }

      var medium_step = 30;
      for (var i = 0; i < minutes_per_step.length; i++) {
          if (distance_between_gtitle / px_per_min <= minutes_per_step[i]) {
              medium_step = minutes_per_step[i];
              break;
          }
      }

      var num_steps = canvansW / px_per_step; //总格数
      // console.log('canvansW====',canvansW);
      var graduation_left;
      var graduation_time;
      
      var lineH;

      var ms_offset = self.ms_to_next_step(start_timestamp,min_per_step*60*1000);//开始的偏移时间 ms
      var px_offset = ms_offset * px_per_ms; //开始的偏移距离 px


      var ms_per_step = px_per_step / px_per_ms; // ms/step
      // console.log('num_steps===',num_steps);
      var fontColor = 'rgba(151,158,167,1)'
      for(var i = 0; i < num_steps; i++){
          graduation_left = px_offset + i * px_per_step; // 距离=开始的偏移距离+格数*px/格
          graduation_time = start_timestamp + ms_offset + i * ms_per_step; //时间=左侧开始时间+偏移时间+格数*ms/格
          let caret_class;
          var date = new Date(graduation_time);
          // console.log('date===',date);
          // console.log('graduation_time=====',graduation_time);
        if (date.getHours() == 0 && date.getMinutes() == 0) {//判断零点
            caret_class = "big";
            lineH = 35;
            var big_date = "00:00";
            let ctx = self.ctx;
            ctx.fillStyle = fontColor; //  0点 特殊 字体样式
            ctx.fillText(big_date, graduation_left - 10,55);
          } else if ((graduation_time / (60 * 1000)) % medium_step == 0) {
            caret_class = "middle";
            lineH = 25;
            var middle_date = self.graduation_title(date);
            // console.log('date=========',);
            let ctx = self.ctx;
            ctx.fillStyle = fontColor; 
            ctx.fillText(middle_date, graduation_left - 10, 55);
          } else {
            lineH = 15;
          }
          self.drawLine(graduation_left,0,graduation_left,lineH,"rgba(151,158,167,1)",1);
      }
    },

    drawLine(beginX,beginY,endX,endY,color,width){
      const self = this
      let ctx = self.ctx
      
      ctx.beginPath();
      ctx.moveTo(beginX,beginY);
      ctx.lineTo(endX,endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();

    },

    add_cells(cells){
      const self = this
      cells.map(m=>{
        self.draw_cell(m,'1')
        if(m.filterList != undefined){
          m.filterList.filter((o,i)=>{
            o["RHeight"] = (i + 1) * 15
            self.draw_cell(o,'2')
          })
        }
        return m.filterList
      })
    },

    draw_cell(cell,num){
      const self = this
      let canvansW = self.canvansW,
      hours_per_ruler = self.hours_per_ruler,
      ctx = self.ctx,
      start_timestamp = self.start_timestamp;

      var px_per_ms = canvansW / (hours_per_ruler * 3600 * 1000); // px/ms
      var beginX = (cell.beginTime - start_timestamp) * px_per_ms;
      var cell_width = (cell.endTime - cell.beginTime ) * px_per_ms;
      // console.log('cell_width====',Math.ceil(cell_width));

      if(num == '1'){
        ctx.fillStyle = "rgba(132, 244, 180, 0.498039)";          //录像片段的时间戳背景
        ctx.fillRect(beginX,0,Math.ceil(cell_width),15);    
      }else if(num == '2'){
        ctx.fillStyle = cell.background;          //录像片段的时间戳背景
        // console.log("cell===",cell);
        ctx.fillRect(beginX,cell.RHeight,Math.ceil(cell_width),15);
      }
    },

    drawCellBg(){
      const self = this
      let ctx = self.ctx,
      canvansW = self.canvansW;
      ctx.fillStyle = "rgba(69, 72, 76, 0.5)";
      ctx.fillRect(0,0,canvansW,15); 
    },
    
    add_events(){
      const self = this
      let canvas = self.canvas;  
      canvas.addEventListener('mousewheel',self.mousewheelFunc,{ passive:false });       //滚动
      window.document.addEventListener('mouseup',self.mouseupFunc,false);
      this.$refs.canvasf.addEventListener('mousemove',self.mousemoveFunc,false);
      // canvas.addEventListener('dblclick',self.dblclickFunc,false);                       //双击
      // canvas.addEventListener('mousedown',self.mousedownFunc,false);                     //点击
      // canvas.addEventListener('mousemove',self.mousemoveFunc,false);                     //移入
      // canvas.addEventListener('mouseup',self.mouseupFunc,false);                         //鼠标离开时
      // canvas.addEventListener('mouseout',self.mouseoutFunc,false);                       //鼠标移出canvas时
    },

    dblclickFunc(e){
      const self = this
      if(self.statics == true){
         let andTime = (self.hours_per_ruler / 2)*3600*1000
          self.start_timestamp = self.poTime - (self.hours_per_ruler*3600*1000)/2
          for(let i=0;i<self.timecell.length;i++){            
            if(self.start_timestamp >= self.timecell[i].beginTime - andTime && self.start_timestamp < self.timecell[i].endTime - andTime){
              
              let defT = (self.timecell[i].beginTime - (self.hours_per_ruler*3600*1000)/2)
              let getT = (defT - self.start_timestamp) / 1000
              if(i != self.defnums){
                self.getdplayers.switchVideo({
                  url:self.timecell[i].url
                })
                self.videoUrl = self.timecell[i].url

                self.defnums = i
                self.Pxt = 0
                self.pre = self.start_timestamp
              }
              self.getdplayers.seek(Math.abs(getT))
              self.getdplayers.play()
              return false
            }
        }
        self.returnTime = self.start_timestamp;
        // self.start_timestamp = time - (self.hours_per_ruler * 3600 * 1000)/2;
        self.fooList()
        setTimeout(()=>{
          self.getdplayers.play()
        },300)
      }
     
    },

    mousedownFunc(e){
      const self = this;
      self.g_isMousedown = true;
      self.g_mousedownCursor = self.get_cursor_x_position(e);     //记住mousedown的位置
      self.pre = self.start_timestamp

      // console.log('self.g_mousedownCursor====',self.g_mousedownCursor);
      // console.log('self.pre====',self.pre);

      // e.stopPropagation()      //取消冒泡
    },

    mousemoveFunc(e){
      const self = this
      self.event = e
      var pos_x = self.get_cursor_x_position(e)
      var px_per_ms = self.canvansW / (self.hours_per_ruler * 60 * 60 * 1000); // px/ms
      self.ismousemove = true
      if(self.g_isMousedown){
          //鼠标拖动时
          self.clearCanvas();
          self.isstatic = false
          self.isplay = true
          self.ismousemove = false
          self.statics = false
          var diff_x = pos_x - self.g_mousedownCursor;
          self.start_timestamp = self.start_timestamp - Math.round(diff_x / px_per_ms);
          self.init(self.start_timestamp,self.timecell);
          self.g_isMousemove = true;
          self.g_mousedownCursor = pos_x;
          self.getdplayers.pause()
          clearInterval(self.timest)

          let andTime = (self.hours_per_ruler / 2)*3600*1000
          
          for(let i=0;i<self.timecell.length;i++){            
            if(self.start_timestamp >= self.timecell[i].beginTime - andTime && self.start_timestamp < self.timecell[i].endTime - andTime){
              if(i != self.defnums){
                self.isdunums = 2
                // console.log('i====',i);
                self.getdplayers.switchVideo({
                  url:self.timecell[i].url
                })
                self.videoUrl = self.timecell[i].url
                self.defnums = i
                self.Pxt = 0
                self.pre = self.start_timestamp
                self.defPrx = null
              }
              if(Math.sign(self.Pxt.toFixed(2)) == -1 || Math.sign(self.Pxt.toFixed(2)) === 0){
                let setT = (self.timecell[i].beginTime - (self.hours_per_ruler*3600*1000)/2)
                let datT = (setT - self.start_timestamp) / 1000
                self.getdplayers.seek(Math.abs(datT))
                // console.log('self.Pxt==****-*-**-=',self.Pxt);
                return false
              }

              self.Pxt = (self.start_timestamp - self.pre) / 1000
              if(self.defPrx != null){    //判断是否存在数据中
                self.Pxt += self.defPrx
              }
              // console.log('self.Pxt===',self.Pxt);
              self.getdplayers.seek(self.Pxt.toFixed(2))
            }
          }
      }else{
          //鼠标移入时
          if(self.ismousemove){
            self.clearCanvas();
            var time = self.start_timestamp + pos_x/px_per_ms;
            self.poTime = time;
            self.isplay = true
            
            if(self.isdunums == 1){
              if(self.defnums <= 0){
                self.defnums = 1
              }
              self.init(self.start_timestamp,self.timecell,self.defnums - 1);
            }else{
              self.init(self.start_timestamp,self.timecell);
            }

            self.drawLine(pos_x,0,pos_x,50,"rgb(194, 202, 215)",1);
            self.ctx.fillStyle = "rgb(194, 202, 215)";
            self.ctx.fillText(self.changeTime(time),pos_x-50,85);
          }
      }

    },

    setTimeData(){
      const self = this
      
      if(self.timest != ""){
        clearInterval(self.timest)
        self.timest = ""
      }

      if(self.timest == ""){
        self.timest = setInterval(()=>{
          self.clearCanvas();
          self.start_timestamp = self.start_timestamp + 1000
          
          self.init(self.start_timestamp,self.timecell)
        },1000)
      }

    },
    
    mouseupFunc(e){  //鼠标拖动放开时
      const self = this
      if(self.g_isMousemove){ //拖动 事件
          self.g_isMousemove = false;
          self.g_isMousedown = false;
          self.ismousemove = false
          window.document.removeEventListener('mousemove',self.mousemoveFunc,false);
          // self.isplay = true
          self.returnTime = self.start_timestamp;
          self.setTimeData()
          
          self.codTime()
          self.fooList()
          self.setTimeData()
          setTimeout(()=>{
            self.getdplayers.play()
            self.statics = true
          },300)
        }else{ // click 事件
            self.g_isMousedown = false;
            // var posx = self.get_cursor_x_position(e); //鼠标距离 px
            // var ms_per_px = (self.zoom * 3600 * 1000) / self.canvansW; // ms/px
            // self.returnTime = self.start_timestamp + posx * ms_per_px;
            // self.set_time_to_middle(self.returnTime);


        }
    },

    mouseoutFunc(e){
      const self = this
      self.clearCanvas();
      self.codTime();
      self.ismousemove = false
      
      this.$refs.canvasf.removeEventListener('mousemove',self.mousemoveFunc,false);
      if(self.g_isMousemove == true){
      //   // console.log('aaaaaa===aaa');
        window.document.addEventListener('mousemove',self.mousemoveFunc,false);
      }else{
        self.codTime();
      }


      if(self.isdunums == 1){
        self.init(self.start_timestamp,self.timecell,self.defnums - 1);
      }else{
        self.init(self.start_timestamp,self.timecell);
      }
    },

    mousewheelFunc(){
      const self = this
      if(self.event && self.event.preventDefault){
          self.event.preventDefault()
      }else{
          self.event.returnValue = false;
          return false;
      }

      var e = window.event || self.event;
      var delta = Math.max(-1,Math.min(1,(e.wheelDelta || -e.detail)));
      var middle_time = self.start_timestamp + (self.hours_per_ruler*3600*1000)/2; //ms 记住当前中间的时间

      if (delta < 0) {
        if(self.zoom >= 1 && self.zoom <= 4){
            self.zoom += 3
        }else if(self.zoom >= 0.4 && self.zoom < 1){
            self.zoom += 0.7
        }else if(self.zoom >= 0.015 && self.zoom < 0.4){
            self.zoom += 0.2
        }else{
            self.zoom = self.zoom + 5;
        }
          
      if (self.zoom >= 24) {
        self.zoom = 24;//放大最大24小时
      }
      self.hours_per_ruler = self.zoom;


    
      } else if (delta > 0) {// 放大
        if(self.zoom <= 4 && self.zoom > 1){
            self.zoom -= 3
        }else if(self.zoom <= 1 && self.zoom > 0.5){
            self.zoom -= 0.5
        }else if(self.zoom <= 0.5 && self.zoom >= 0.1){
            self.zoom -= 0.4
        }else{
            self.zoom -= 5;
        }
		    if (self.zoom < 0.09) {
			    self.zoom = 0.015;//缩小最小1小时
        }
        self.hours_per_ruler = self.zoom;
      }
      // console.log("self.zoom=====",self.zoom);


      // console.log('self.zoom====',self.zoom);
      self.clearCanvas();
      self.start_timestamp = middle_time - (self.hours_per_ruler*3600*1000)/2; //start_timestamp = 当前中间的时间 - zoom/2
      if(self.isdunums == 1){
        self.init(self.start_timestamp,self.timecell,self.defnums - 1);
      }else{
        self.init(self.start_timestamp,self.timecell);
      }

    },

    get_cursor_x_position(e){
      var posx = 0;
      
      if (! e) {
        e = window.event;
      }
      
      if (e.offsetX || e.offsetY) {
        posx = e.offsetX;
      }
      // if (e.clientX || e.clientY) {
      //   posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      // }
      return posx;
    },

    graduation_title(datetime){

      if (
        datetime.getHours() == 0 &&
        datetime.getMinutes() == 0 &&
        datetime.getMilliseconds() == 0
      ) {
        return (
          ("0" + datetime.getDate().toString()).substr(-2) +
          "." +
          ("0" + (datetime.getMonth() + 1).toString()).substr(-2) +
          "." +
          datetime.getFullYear()
        );
      }
      return (
        datetime.getHours() +
        ":" +
        ("0" + datetime.getMinutes().toString()).substr(-2)
      );
    },

    changeTime (time) {
      var newTime = new Date(time);
      var year = newTime.getFullYear();
      var month = newTime.getMonth() + 1;
      if(month < 10){
          var month = "0" + month;
      }
      var date = newTime.getDate();
    if (date < 10) {
          var date = "0" + date;
      } 
      var hour = newTime.getHours();
      if (hour < 10) {
          var hour = "0" + hour;
      }
      var minute = newTime.getMinutes();
      if (minute < 10) {
          var minute = "0" + minute;
      }
      var second = newTime.getSeconds();
      if (second < 10) {
          var second = "0" + second;
      }
      return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
    },

    ms_to_next_step(timestamp, step) {
      var remainder = timestamp % step;
      // console.log("timestamp=====",timestamp);
      // console.log('step====',step);
      return remainder ? step - remainder : 0;
    },

    fooList(){
      const self = this

      let deflist = []
      let andTime = (self.hours_per_ruler / 2)*3600*1000
      let Purl = ''
      for(let i=0;i<self.timecell.length;i++){
        deflist.push(self.timecell[i].beginTime - andTime)
      }
      deflist.sort((res,bat)=>{
        return Math.abs(res - self.start_timestamp) - Math.abs(bat - self.start_timestamp)
      })
      let aa = 0
      for(let i=0;i<self.timecell.length;i++){

        if(self.start_timestamp >= self.timecell[i].beginTime - andTime && self.start_timestamp < self.timecell[i].endTime - andTime){
          aa = 1
          self.defPrx = self.Pxt
          break
        }else{
          if(deflist[0] + andTime == self.timecell[i].beginTime){
            Purl = self.timecell[i].url
            self.defnums = i
            // console.log('====',i);
          }
          // console.log("i===",i);
          self.defPrx = null
          aa = 2
        }
      }

      setTimeout(()=>{
        if(aa == 1){
          self.set_time_to_middle(self.returnTime,'1');
        }else if(aa == 2){
          self.set_time_to_middle(self.returnTime,'2',Purl,deflist[0]);
        }
      },100)

    },

    //让中心点跳到某个位置
    set_time_to_middle(time,bool,Purl,tyTime){
      const self = this
      self.clearCanvas();
      if(bool == '1'){

        self.start_timestamp = time;
        
      }else{
        clearInterval(self.timest)
        self.start_timestamp = tyTime
        self.getdplayers.switchVideo({
          url:Purl
        })
        self.videoUrl = Purl
        // self.setTimeData()
        // setTimeout(()=>{
        //   self.getdplayers.play()
        // },300)
      }
      self.init(self.start_timestamp,self.timecell)
      // console.log('self.videoUrl===',self.videoUrl);
    },

    returnMouseupTime(){
      const self = this
      if(self.returnTime != null){
          return self.returnTime;
      }
    },

    clearCanvas(){
      const self = this
       
      self.ctx.clearRect(0,0,self.canvansW,self.canVansH);

    }


  },
};
</script>
<style lang='scss' scoped>

$sel_color:#188cf8;
$text_yellow:#fbba40;

.canvas_fl{
  width: 100%;
  // height: 13vh;
  margin: 1% 0;
}
.video_url_card{
    width: 15vmin;
    height: 10vmin;
    margin-right: 1vmin;
    object-fit:fill;
    border-radius: 1vmin;
    cursor: pointer;
  }
.video_fl{
  width: 50%;
  height: 50%;
  position: relative;
  left: 50%;
  transform:translate(-50%);
  margin-top: 1%;
  .video_url{
    width: 850px;
    height: 500px;
    object-fit:fill;
    display: none;
  }
}
.rulers_fl{
  width: 1750px;
  height: 200px;
}
.line_time{
  position: relative;
  width: 1740px;
  padding: 41 px 0 20px;
  overflow: hidden;
  -webkit-user-select:none;
   -moz-user-select:none;
   -ms-user-select:none;
   user-select:none;
  //  overflow: hidden;
  .all_line{
    width: 90%;
    margin: 0 5%;
    padding: 6vmin 0;
    overflow: hidden;
  }
  .po_fl{
    width: 100%;
    position: absolute;
    top: 0;
  }
  
  .all_line_fl{
    width: 90%;
    margin: 0 5%;
    padding: 6vmin 0;
    // overflow: hidden;
    position: relative;
    z-index: 10;
  }  

  .scale_line_fl{
    overflow: hidden;
    height: 10vmin;
    position: absolute;
    top: 7vmin;
    z-index: 1;
    width: 90%;
    margin: 0 5%;
    .scale_line{

      position: absolute;
      // left: -4%;
      transform-origin:0 0;
      text-align: left;
      display: flex;
      // transform: translateX(-2%);
      // height: 3vmin;
    }
    .sca_bor{
      width: 100px;
      height: 1.5vmin;
      border-left: 1px solid #000;
    }
    .sca_bor:first-child{
      margin-left:0px;
    }
    .sca_bor_hui{
      width: 100px;
      height: 1vmin;
      // line-height: 2vmin;
      border-left: 1px solid #000;
    }
    .sca_bor_hui:first-child{
      background: #000;
    }
    .sca_text{
      width: 3rem;
      font-size: 0.05vmin;
      line-height: 5vmin;
      text-indent: -2px;
    }
    
  }
 
  .line{
    width: 100%;
    height: 1vmin;
    background: #ccc;
    position: relative;
    
  }
  .can_line{
    background: #1890ff77;
    height: 3px;
    width: 20%;
    position: absolute;
    left: 0;
    span{
      position: absolute;
      right: 0;
      margin-top: 20px;

    }
  }
  .reference{
    width: 1px;
    height: 8px;
    border: 0;
    background: #bbb;
    position: absolute;
    top: -3px;
    white-space: nowrap;
    em{
      color: #bbb;
      position: absolute;
      // transform: translateX(-50%);
      margin-top: 15px;
      font-size: 12px;
    }
  }
  .dot{
    width: 0.3vmin;
    height: 1vmin;
    // border-radius: 50%;
    // border: 2px solid $sel_color;
    background:$sel_color;
    position: absolute;
    // top: -1vmin;
    white-space: nowrap;
    margin-left: -4px;
  }
  .dot_all{
    em{
      display: none;
      color: $sel_color;
      transform: translateX(-50%);
      margin-top: 25px;
    }
  }
  // .dot_all:hover{
  //   width: 10px;
  //   height: 10px;
  //   // border: 2px solid $sel_color;
  //   top: -4px;
  //   em{
  //     display: inline-block;
  //   }
  // }
  
  .sel_dot{
    width: 0.5vmin;
    height: 2vmin;
    top: 5.5vmin;
    // border: 2px solid $text_yellow;
    background:$text_yellow;
    box-shadow: 0 0 10px 4px #faa30255;
    z-index: 5;
    position: absolute;
    
    .card_item{
      width: 100px;
      height: 100px;
      background: #000;
      display: inline-block;
      position: absolute;
      top: 30px;
      left: -300%;
    }
    em{
      position: absolute;
      top: -50px;
      border: 1px solid #ccc;
      display: inline-block;
      padding: 0 20px;
      line-height: 26px;
      border-radius: 13px;
      white-space: nowrap;
      transform: translateX(-50%);
      color: $text_yellow;
    }
    i{
      contain: '';
      border: 1px solid #ccc;
      background: white;
      width: 10px;
      height: 10px;
      display: block;
      position: absolute;
      transform: rotate(45deg);
      bottom: -4px;
      left: 50%;
      border-top: 0;
      border-left: 0;
    }
  }
  // .sel_dot_left{
  //   em{
  //     // transform: translateX(-20%);
  //   }
  //   i{
  //     left: 20%;
  //   }
  // }
  // .sel_dot_right{
  //   em{
  //     // transform: translateX(-80%);
  //   }
  //   i{
  //     left: 80%;
  //   }
  // }
}
.ant-calendar-picker{
  margin-left: 20px;
}
.viderlist_codk{
  display: none; 
}
.defDl_fl{
  margin-right: 1vmin;
  position: relative;
  .defdl_text{
    position: absolute;
    color: #fff;
    font-size: calc(1vmin + 10px);
  }
}
.listShow{
  .icons{
    cursor: pointer;
  }
  .viderlist{
    height: 20vmin;
    overflow-y: auto;
    text-align: left;
  .videoItem{
    width: 20vmin;
    height: 15vmin;
    display: inline-block;
    margin:2vmin 2vmin 0vmin 0vmin;
    position: relative;
    cursor: pointer;
  .Time_t{
    position: absolute;
    top: 0%;
    left: 2%;
    color: #fff;
    font-size: calc(10px + 1vmin);
  }
  .duration_text{
    position: absolute;
    top: 0%;
    right: 2%;
    color: #fff;
    font-size: calc(10px + 1vmin);
  }
  .video_play{
    width: 100%;
    height: 100%;
    object-fit:fill;
    border-radius: 1vmin;
    padding: 0vmin;
  }
  .video_play_bor{
    border: 0.4vmin solid #b7daff;
  }
} 
}
}
</style>