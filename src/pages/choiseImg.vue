<template>
    <div>
        <input type="button" value="上传" @click="getImgSdk">
    </div>
</template>
<style lang="scss" scoped></style>
<script>
    import {getSDK} from '../service/album'
    export default{
        data(){
            return {
                wx:null
            }
        },
        mounted(){
            this.getImg()
        },
        methods:{
            async getImg(e){
                let res=await getSDK({ askUrl:location.href.split('#')[0] })
                this.initSdk(res,(wx)=>{
                    this.wx=wx
                })
            },
            getImgSdk(){
                this.wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                        console.log(res)
                    }
                })
            }
        }
    }
</script>
