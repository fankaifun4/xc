<template>
    <div id="demo">  
        <!-- 遮罩层 -->  
        <div class="container" v-show="panel">  
          <div>  
              <img id="image" :src="url" alt="Picture">  
          </div>
          <button type="button" id="button" @click="crop">确定</button>
          <button type="button" id="aaa" @click="setUrl">更改图片</button>
        </div>  
  </div>  
</template>
<script>
  import Cropper from 'cropperjs'
  import '../style/cropper.scss'
  export default {  
  components: {  

  },  
  data () {  
    return {  
      headerImage:'',  
      picValue:'',  
      cropper:'',  
      croppable:false,  
      panel:false,  
      url:''  
    }  
  },  
  mounted () {  
    //初始化这个裁剪框  
    var self = this;  
    var image = document.getElementById('image');  
    this.cropper = new Cropper(image, {  
      aspectRatio: 1,  
      viewMode: 1,  
      background:false,  
      zoomable:false,  
      ready: function () {  
        self.croppable = true;  
      }  
    });  
    this.url = aa_1;  
    //每次替换图片要重新得到新的url  
    if(this.cropper){  
      this.cropper.replace(this.url);  
    }  
    this.panel = true;  
  },  
  methods: {  
    getObjectURL (file) {  
      var url = null ;   
      if (window.createObjectURL!=undefined) { // basic  
        url = window.createObjectURL(file) ;  
      } else if (window.URL!=undefined) { // mozilla(firefox)  
        url = window.URL.createObjectURL(file) ;  
      } else if (window.webkitURL!=undefined) { // webkit or chrome  
        url = window.webkitURL.createObjectURL(file) ;  
      }  
      return url ;  
    },  
    setUrl(){
      let aa_1="http://localhost:8080/static/bgc/1.jpg"
      let aa_2="http://localhost:8080/static/bgc/2.jpg"
      let aa_3="http://localhost:8080/static/bgc/3.jpg"
       this.url = aa_2;  
    //每次替换图片要重新得到新的url  
      if(this.cropper){  
        this.cropper.replace(this.url);  
      }  
    },
    change (e) {  
      // let files = e.target.files || e.dataTransfer.files;  
      // if (!files.length) return;  
      // this.panel = true;  
      // this.picValue = files[0];  
      let aa_1="http://localhost:8080/static/bgc/1.jpg"
      let aa_2="http://localhost:8080/static/bgc/2.jpg"
      let aa_3="http://localhost:8080/static/bgc/3.jpg"
      let a=Math.random()*3
      console.log(a)
      this.url = aa;  
      console.log(this.url)
      //每次替换图片要重新得到新的url  
      if(this.cropper){  
        this.cropper.replace(this.url);  
      }  
      this.panel = true;  

    },  
    crop () {  
        this.panel = false;  
        var croppedCanvas;  
        var roundedCanvas;  

        if (!this.croppable) {  
          return;  
        }  
        // Crop  
        croppedCanvas = this.cropper.getCroppedCanvas();  
        console.log(this.cropper)  
        // Round  
        roundedCanvas = this.getRoundedCanvas(croppedCanvas);  

        this.headerImage = roundedCanvas.toDataURL();  
        this.postImg()  

    },  
    getRoundedCanvas (sourceCanvas) {  
      var canvas = document.createElement('canvas');  
      var context = canvas.getContext('2d');  
      var width = sourceCanvas.width;  
      var height = sourceCanvas.height;  
      canvas.width = width;  
      canvas.height = height;  
      context.imageSmoothingEnabled = true;  
      context.drawImage(sourceCanvas, 0, 0, width, height);  
      context.globalCompositeOperation = 'destination-in';  
      context.beginPath();  
      context.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, 2 * Math.PI, true);  
      context.fill();  
      return canvas;  
    },  
    postImg () {  
      //这边写图片的上传  
    }  
  }  
}  
</script>
<style lang="scss" scoped>
*{  
  margin: 0;  
  padding: 0;  
}  

#demo .show {  
  width: 100px;  
  height: 100px;  
  overflow: hidden;  
  position: relative;  
  border-radius: 50%;  
  border: 1px solid #d5d5d5;  
}  
#demo .picture {  
  width: 100%;  
  height: 100%;  
  overflow: hidden;  
  background-position: center center;  
  background-repeat: no-repeat;  
  background-size: cover;   
}  
#demo .container {  
    z-index: 99;  
    position: fixed;  
    padding-top: 60px;  
    left: 0;  
    top: 0;  
    right: 0;  
    bottom: 0;  
    background:rgba(0,0,0,1);  
}
#demo #image {  
  max-width: 100%;  
}
</style>
