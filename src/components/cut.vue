<template>
	<section class="layz">
		<div class="wrap">
			<div class="layzbody">
				<div class="ctrl">
					<div class="save" data-method="getCroppedCanvas" @click="showCanvas" >确定</div>
					<div class="cancel" @click="cancal">取消</div>
					<div class="reset" @click="reset" >重置</div>
				</div>
				<div class="imgwrap">
					<img :src="cutUrl" alt="" ref="cutImg">
				</div>
			</div>
		</div>
		<!-- Show the cropped image in modal -->
        <div class="modal docs-cropped" id="getCroppedCanvasModal" 
			v-show="isDroop"
			aria-labelledby="getCroppedCanvasTitle" role="dialog" tabindex="-1"	>
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal" type="button" @click="isDroop=false">&times;</button>
                <h4 class="modal-title" id="getCroppedCanvasTitle">截取图像</h4>
              </div>
              <div class="modal-body" ref="canvasWrap"></div>
			  <div class="ctrl">
				   <div class="getsave" @click="getSave">确定</div>
				   <div class="cancel" @click="isDroop=false">取消</div>
			  </div>
            </div>
          </div>
        </div><!-- /.modal -->
	</section>
</template>
<script>
	import {mapState,mapActions} from 'vuex'
	import Cropper from 'cropperjs'
	import {upload} from '../service/album'
	import '../style/cropper.scss'
	export default{
		props:['aspectr','cutUrl'],
		data(){
			return{
		        cropper:'',  
				croppable:false,  
				isDroop:false
			}
		},
		mounted(){
			this._initCropper()
		},
		methods:{
			//初始化裁剪插件
			_initCropper(){
				let img=this.$refs.cutImg
				this.cropper=new Cropper(img,{
					aspectRatio: this.aspectr,  
					viewMode: 1,  
					background:true,  
					zoomable:true,  
					checkCrossOrigin:false,
					dragMode:'move',
					restore:true,
					ready: function () {  
					}  
				})
			},
			//取消
			cancal(){
				this.$emit('cancel')
			},
			//显示裁剪预览
			showCanvas(){
				let canvasWrap=this.$refs.canvasWrap;
				let canvas=this.cropper.getCroppedCanvas()
				if( canvasWrap.children.length>0 ){
					canvasWrap.removeChild(canvasWrap.children[0])
				}
				canvasWrap.appendChild(canvas)
				this.isDroop=true;
			},
			//保存裁剪素材
			async getSave(){
				this.$parent.isloading=true
				this.cropper.getCroppedCanvas().toBlob(async (boble)=>{
					var formData = new FormData()
					formData.append('file',boble,'jpg')
					let uploadData = await upload(formData)
					this.$parent.isloading=false
					this.$emit('setCutImage',uploadData.img)
					this.isDroop=false
					this.$emit('cancel')
				},"image/jpeg",.8)
			},
			//重置裁剪
			reset(){
				this.cropper.reset();
			}
		},
		watch:{
			//监听缓存图片路径如果改变则重新初始化裁剪
			'cutUrl':function(prev,old){
				if(this.cropper){
					 this.cropper.replace(this.cutUrl)
					 this.cropper.setAspectRatio(this.aspectr)
				}
			}
		}

	}
</script>
<style  lang='scss'>
	.layz{
		position:fixed;
		left:0;
		right: 0;
		top:0;
		bottom: 0;
		z-index:400;
		/**
			** modal start
		*/
		.modal{
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1040;
			overflow: hidden;
			outline: 0;
			.modal-dialog{
				position: relative;
				width: auto;
				margin: 10px;
				padding-top:15%;
				.modal-content{
					position: relative;
					background-color: #fff;
					background-clip: padding-box;
					border: 1px solid #999;
					border: 1px solid rgba(0,0,0,.2);
					border-radius: 6px;
					outline: 0;
					box-shadow: 0 3px 9px rgba(0,0,0,.5);
					.modal-header{
						min-height: 16.43px;
						padding: 15px;
						border-bottom: 1px solid #e5e5e5;
						.modal-title {
							margin: 0;
							line-height: 1.42857143;
							font-size: 32px;
							text-align: center;
						}
						>button{
							float: right;
							font-size: 21px;
							font-weight: 700;
							line-height: 1;
							color: #000;
							text-shadow: 0 1px 0 #fff;
							filter: alpha(opacity=20);
							opacity: .2;
							&.close{
								padding: 0;
								cursor: pointer;
								background: 0 0;
								border: 0;
								margin-top: -2px;
							}

						}
					}
					.modal-body {
						position: relative;
						padding: 30px;
						canvas{
							max-width:100%;
							margin:0 auto;
							display: block;
						}
						img{
							max-width:100%;
						}
					}
				}
			}
		}
		.ctrl{
			color:#fff;
			display:flex;
			justify-content:center;
			background:#333;
			padding:10px;
			>div{
				padding:15px 30px;
				text-align: center;
				border:1px solid #ccc;
				margin:10px 30px;
				font-size:32px;
			}	
			.save{
				background:#090;
			}
			.reset{
				background:#f20;
			}
			.cancel{
				background:#ccc;
			}
		}
		/**
			** modal end
		*/
		.wrap{
			width:100%;
			height:100%;
			position:relative;
			background:url('./static/bg.png');
			.layzbody{
				height:100%;
				width:100%;
				overflow-y:auto;
				.imgwrap{
					width:100%;
					top:150px;
					bottom:0;
					left:0;
					right:0;
					position:absolute;
					overflow: hidden;
				}
			}
		}

	}
	.btn-ctrl{
		margin-top:30px;
		display:flex;
		justify-content:center;
		>input{
			padding:15px 30px;
			background:#f90;
			border:1px solid #ccc;
			border-radius: 5px;
			margin:0 10px;
		}
	}
	.getsave{
		display:inline-block;
		border:1px solid #000;
		background:#090;
		padding:15px 30px;
		color:#fff;
	}
</style>