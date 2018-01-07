<template>
  <div class="loade">
      <div class="loader loader--spinningDisc"></div>
  </div>
</template>
<style scoped lang='scss'>
.loade{
    position: absolute;
    left: 0;
    top:0;
    bottom:0;
    right:0;
    background:rgba(0,0,0,.5);
    z-index:999;
}
.loader--spinningDisc {
  border: solid 0.2rem #04f3fb;
  border-right-color: transparent;
  border-left-color: transparent;
  padding: 0.5rem;
  width: .5rem;
  height: .5rem;
  border-radius: 50%;
  background: #fa0303;
  background-clip: content-box;
  animation: spinDisc 1.5s linear infinite;
  position: absolute;
  left: 0;
  right: 0;
  bottom:0;
  top:0;
  margin:auto;
}
@keyframes spinDisc {
  50% {
    border-top-color: #e8f806;
    border-bottom-color: #f71212;
    background-color: #b0f807;
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>

