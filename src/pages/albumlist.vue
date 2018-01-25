<template>
  <section class="al-list">
      <header class="header">
          <span class="fl" @click="goBack"  v-if="!canBack">
              <span class="iconfont  icon-prev"></span>
        		返回
        	</span>
        	<span class="header-title" :class="{'center':canBack}">
        		我的相册
        	</span>
        </header>
      <div v-if="!hasno" class="swiper-data">
         <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,key) in albumList" :key="key">
                    <imgshow :imgdata="item" />
                </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
        </div>
      </div>
      <div v-if="hasno" class="nodata">
          {{this.tip}}
      </div>
  </section>
</template>
<script>
    import Swiper from 'swiper'
    import {getMyAlbList} from '../service/album'
    import imgshow from '@/components/imgshow'
    export default{
        data(){
          return{
            albumList:[],
            id:null,
            hasno:true,
            tip:"",
            swiper:null,
            canBack:null
          }  
        },
        components:{
            imgshow
        },
        mounted () {
            
            this.id=this.$route.query.id
            this.canBack=this.$route.query.hidden?true:false
            this.getData(this.id)
        },
        computed:{},
        methods:{
            async getData(id){
                let res = await getMyAlbList({id:id})
                if(!res.code){
                    this.hasno=true
                    this.tip="这个相册没有存货哟"
                    return
                }
                this.hasno=false
                this.albumList=res.data
                setTimeout(()=>{
                    this.swiper = new Swiper('.swiper-container', {
                        pagination : '.swiper-pagination',
                        paginationClickable: true,
                        paginationType : 'fraction',
                        observer:true,
                        spaceBetween:15,
                        lazyLoading : true
                    });
                },100)
            },
            goBack(){
                this.$router.push({name:"mylist",query:{id:this.id}})
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "../style/swiper.scss";
.ali{
    height:400px;
    background: #fff;
}
.al-list{
    height: 100%;
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
    .header-title{
        margin-left:-80px;
    }
    .center{
        margin-left:0;
    }
}
.swiper-data{
     padding:40px;
}

.swiper-slide{
    box-sizing: border-box;
    >img{
        display: block;
        border:none;
        width:100%;
    }
}

.nodata{
    display: flex;
    align-items: center;
    justify-content: center;
    padding:50px;
    color:#fff;
    font-size:32px;
}
</style>
