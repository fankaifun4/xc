<template>
  <div class="watch-main">
        <transition :name="transitionName">
            <router-view ></router-view>
        </transition>
  </div>
</template>
<script>
export default {
  data(){
      return{
          transitionName:"router-pop-out"
      }
  },
  mounted () {
      
  },
  computed:{

  },
  methods: {
       
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
<style lang="scss" scoped>
.watch-main{
    min-height:100%;
}
.header{
		padding:20px 15px;
		font-size:34px;
		text-align: center;
		background:#333;
		color:#fff;
		font-weight: 700;
		height:50px;
		position:relative;
		.gotodraw{
			float:left;
			display:flex;
			align-items:center;
			width:150px;
		}
		.title{
			display:flex;
			align-items:center;
			justify-content:center;
			text-align: center;
			position:absolute;
			left:50%;
			margin-left:-150px;
			width:300px;
		}
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


