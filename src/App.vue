<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>
<script>
import "./iconfont/iconfont.scss"
export default {
  name: 'app',
  data(){
    return{
      transitionName:"router-pop-in"
    }
  },
  mounted(){
   
  },
  methods:{
    IsPC() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  },
  watch:{
    $route:function(to,from){
        const toDepth = to.path.split('/').length
        const fromDepth = from.path.split('/').length
        this.transitionName = toDepth < fromDepth ? 'router-pop-out' : 'router-pop-in'
    }
  }
}
</script>
<style>
#app{
  width:100%;
  min-height:100%;
  background:url('./static/bg.png');
  overflow-y:hidden;
  box-sizing: border-box;
}
.router-pop-out-enter-active,
  .router-pop-out-leave-active,
  .router-pop-in-enter-active,
  .router-pop-in-leave-active {
    will-change: transform,opacity;
    transition: all 400ms;
    width: 100%;
    height: 100%;
    top: 0;
    position: absolute;
    backface-visibility: hidden;
  }

  .router-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .router-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .router-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .router-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
</style>
