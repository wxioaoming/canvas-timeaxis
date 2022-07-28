<template>
  <div>
    <div>
      
    </div>

  </div>
</template>


<script>
import {Time} from '../../minix/index'
export default {
  data(){
    return{
     index:0
    }
  },
  created () {
    const self = this
    console.log('重新调用',self.index + 1);
  },
  mounted () {
    const self = this
    

  },
}
</script>


<style scoped>


</style>