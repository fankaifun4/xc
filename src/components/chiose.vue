<template>
    <section class="choiseWrap">
        <header class="header">
            <div @click="choiseItems">确定返回</div>
        </header>
        <div class="images-wrap" ref='imagesWrap'>
            <div v-for="(item,key) in imglists" :key="key" :class="{'isChoise':active==key}"  @click="togetImg(key)">
                <img :src="baseUrl+item"/>
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
        //   this.$router.push({name:'pagehome',query:{ id:id,imgurl: this.choiseImg }})
      },
      setImage(){
         this.imglists=this.imglist
      },
      togetImg(key){
          let url=this.baseUrl+this.imglists[key]
          this.choiseImg=url
          this.active=key
      },
      goback(){
           this.$emit('hidden')
      }
  }
}
</script>
<style lang="scss" scoped>
    .choiseWrap{
        position: absolute;
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
        line-height: 80px;
        border-bottom:1px solid #ccc;
        font-size: 34px;
        padding:0 15px;
        background:#fff;
    }
    .images-wrap {
       display: flex;
       flex-direction:center;
       flex-wrap:wrap;
       >div{
            width:30%;
            padding:15px;
            box-sizing: border-box;
            border:3px solid rgb(5, 78, 17);
            margin:10px;
            background:#fff;
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
                width:300px;
                height: 200px;
                margin:auto;
                display:flex;
                flex-direction:column ;
                align-items: center;
                >div{
                    margin:15px 0;
                }
            }
       }
       .isChoise{
           border:3px solid rgb(192, 17, 17);
           background:rgb(25, 4, 92)
       }
    }
</style>
