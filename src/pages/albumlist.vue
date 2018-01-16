<template>
  <section class="al-list">
      <header class="header">
          <span class="fl" @click="goBack">
              <span class="iconfont  icon-prev"></span>
        		返回
        	</span>
        	<span class="header-title">
        		查看我的相册
        	</span>
        	
        </header>
      <div v-if="!hasno">
         <div class="swiper-container">
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,key) in albumList.list" :key="key">
                    <img  :src="item.bgImg" :id="item.id" ref="lists" alt="" >
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
    import {upload,getAlbum,uploadAlbums} from '../service/album'
    export default{
        data(){
          return{
            albumList:{},
            id:null,
            hasno:true,
            tip:""
          }  
        },
        mounted () {
            this.id=this.$route.query.id
            this.getData(this.id)
            this.swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                initialSlide: 0,
                paginationType: 'fraction',
                preloadImages: true,
                observer:true,
            });
        },
        computed:{

        },
        methods:{
            async getData(id){
                let res = await getAlbum({id:id})
                if(!res.code){
                    this.hasno=true
                    this.tip="这个相册没有存货哟"
                    return
                }
                this.hasno=false
                this.albumList=res.data
            },
            goBack(){
                this.$router.push({name:"mylist",query:{id:this.id}})
            }
        }
    }
</script>
<style lang="scss" scoped>
@import "../style/swiper.scss";
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
}
    .swiper-container{
        width:100%;
        .swiper-slide{
            padding:15px;
            background:#fff;
            box-sizing: border-box;
            >img{
                display: block;
                border:none;
                width:100%;
            }
        }
        .swiper-pagination{
            background: rgba(0,0,0,.5);
            color:#fff;
            font-size:30px;
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
