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
        <div class="modal fade docs-cropped" id="getCroppedCanvasModal" aria-hidden="true" aria-labelledby="getCroppedCanvasTitle" role="dialog" tabindex="-1">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button class="close" data-dismiss="modal" type="button" aria-hidden="true">&times;</button>
                <h4 class="modal-title" id="getCroppedCanvasTitle">Cropped</h4>
              </div>
              <div class="modal-body"></div>
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
	import "../libs/cropper.js"
	import "../libs/bootstrap.min.js"
	import '../style/cropper.scss';
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
		        }
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
				$('.save').on('click',function(){
					let data=$(this).data();
					if (data.method === 'getCroppedCanvas') {
			          $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
			        }
				})
				
			}
		}

	}
</script>
<style scoped lang='scss'>
	@import '../style/comm.scss';
	.docs-cropped .modal-body {
	  text-align: center;
	}

	.docs-cropped .modal-body > img,
	.docs-cropped .modal-body > canvas {
	  max-width: 100%;
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

	.layz{
		position:absolute;
		left:0;
		right: 0;
		top:0;
		bottom: 0;
		z-index:200;
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