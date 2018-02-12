<template>
    <section class="choiseWrap">
        <header class="header">
            <div class="choiseItems" @click="choiseItems">确定返回</div>
            <div class="cancelItems" @click="cancelItems">取消</div>
        </header>
        <div class="images-wrap" ref='imagesWrap'>
          <div class="items-list">
            <div v-for="(item,key) in imglists" :key="key" :class="{'isChoise':active==key}"  @click="togetImg(key)">
                <img :src="item"/>
            </div>
          </div>
            
            <div class="isempty" v-if="imglists.length<1">
                <div>还没有上传的图片</div>
                <div @click="goback">返回</div>
            </div>
        </div>
    </section>
</template>
<script>
import {mapState,mapActions} from 'vuex'
export default {
  data(){
      return{
          imglists:[],
          choiseImg:"",
          active:null,
          baseUrl:'http://tp.taodama.net/'
      }
  },
  mounted(){
      this.setImage()
  },
  computed:{
      ...mapState(['imgId','imgUrl','imglist']),
	    ...mapActions(['setImg','getImg','getAll']),
  },
  methods:{
      choiseItems(){
          let id=this.$route.query.id
          this.$emit('changeImgUrl',this.choiseImg)
          this.$emit('hidden')
      },
      setImage(){
         this.imglists=this.imglist
      },
      togetImg(key){
          let url=this.imglists[key]
          this.choiseImg=url
          this.active=key
      },
      goback(){
           this.$emit('hidden')
      },
      cancelItems(){
          this.$emit('hidden')
      }
  }
}
</script>
<style lang="scss" scoped>
    .choiseWrap{
        position: fixed;
        z-index:400;
        top:0;
        bottom:0;
        left: 0;
        right:0;
        height:100%;
        background:rgba(0,0,0,.5)
    }
    .header{
        height:80px;
        padding:15px;
        background:#333;
        color:#fff;
        position:absolute;
        top:0;
        left:0;
        width:100%;
        .choiseItems{
           margin-left:10px;
           background:#f00;
           display:inline-block;
           height:70px;
           width:180px;
           text-align: center;
           line-height: 69px;
           font-size:36px;
           border:3px solid #2f0;
        }
        .cancelItems{
          margin-left:10px;
           background:#ccc;
           display:inline-block;
           height:70px;
           width:180px;
           text-align: center;
           line-height: 69px;
           font-size:36px;
           border:3px solid #f20;
        }
    }
    .images-wrap {
       position:absolute;
       top:100px;
       bottom:0;
       left:0;
       right:0;
       overflow:auto;
       >.items-list{
          position:relative;
          display: flex;
          flex-direction:center;
          flex-wrap:wrap;
          .isChoise{
             border:3px solid rgb(192, 17, 17);
             background:rgba(80,200,0,.5)
          }
          >div{
              width:30%;
              padding:15px;
              box-sizing: border-box;
              border:3px solid rgba(0,0,0,.8);
              background:rgba(255,255,255,.6);
              margin:10px;
              transition:all .5s;
              >img{
                  width:100%;
              }
              
              &.isempty{
                  color:#f00;
                  position:absolute;
                  left: 0;
                  right: 0;
                  bottom:0;
                  top:0;
                  width:400px;
                  height: 200px;
                  margin:auto;
                  display:flex;
                  flex-direction:column ;
                  align-items: center;
                  >div{
                      margin:15px 0;
                      font-size: 36px;
                  }
              }
          }
       }
       
       
    }
</style>
