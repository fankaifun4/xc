<template>
	<section class="layz">
		<div class="wrap">
			<div class="layzbody">
				<div class="ctrl">
					<div class="save" data-method="getCroppedCanvas">确定保存</div>
					<div class="cancel">取消</div>
					<div class="reset">重置</div>
				</div>
				<div class="imgwrap">
					<img src="../assets/bgs/aa.png" alt="" ref="cutImg">
				</div>
			</div>
		</div>
		<!-- Show the cropped image in modal -->
        <div class="modal docs-cropped" id="getCroppedCanvasModal" 
			v-show="isDroop"
			aria-labelledby="getCroppedCanvasTitle" role="dialog" tabindex="-1" @click="isDroop=false">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal" type="button" @click="isDroop=false">&times;</button>
                <h4 class="modal-title" id="getCroppedCanvasTitle">截取图像</h4>
              </div>
              <div class="modal-body">
			  </div>
              <!-- <div class="modal-footer">
                <button class="btn btn-primary" data-dismiss="modal" type="button">Close</button>
              </div> -->
            </div>
          </div>
        </div><!-- /.modal -->
	</section>
</template>
<script>
	import '../libs/jquery.min.js'
	import '../libs/cropper.js'
	import '../libs/bootstrap.min.js'
	import '../style/cropper.scss'
	export default{
		props:['aspectr'],
		data(){
			return{
				imgCropperData: {
					accept: 'image/gif, image/jpeg, image/png, image/bmp',
					maxSize: 5242880,
					file: null, //上传的文件
					imgSrc: '', //读取的img文件base64数据流
					imgUploadSrc: '', //裁剪之后的img文件base64数据流
		        },
		        imgObj: null,
		        hasSelectImg: false,
		        cropperLoading: false,
		        isShort: false,
		        result:null,
		        options:{
		        	dragCrop: false,
		        	setDragMode:"move",
		        	aspectRatio:this.aspectr,
					crop: function (data) {
					}
				},
				isDroop:false
			}
		},
		mounted(){
			this._initCropper()
		},
		methods:{
			_initCropper(){
				let $=jQuery;
				let $img=jQuery(this.$refs.cutImg);
				let result=$img.cropper(this.options)
				let _this=this;
				$('.save').on('click',function(){
					let data=$(this).data();
					_this.isDroop=true;
					result = $img.cropper(data.method, data.option);
					$('#getCroppedCanvasModal').find('.modal-body').html(result);
				})
				$('.reset').on('click',function(){
					$img.cropper('reset');
				})
				
			}
		}

	}
</script>
<style  lang='scss'>
	

	.layz{

		position:absolute;
		left:0;
		right: 0;
		top:0;
		bottom: 0;
		z-index:200;
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
			>div{
				padding:15px 30px;
				text-align: center;
				border:1px solid #ccc;
				border-radius: 5px;
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
			background:#fff;
			.layzbody{
				height:100%;
				width:100%;
				overflow-y:auto;
				.imgwrap{
					width:100%;
					top:300px;
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

</style>