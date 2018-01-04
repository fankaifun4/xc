<template>
	<section class="main-container">
		<div class="xc-content">
			<div class="xc-wrap" ref="canvaswrap">
				<canvas ref="canvas" class="canvas" @click="getItems"></canvas>
			</div>
			<div class="ctrl">
				<div class="ctrl-i">
					<div class="btn" @click="sliceLeft(-1)">左移</div>
					<div class="value">{{computedValue.left}}</div>
					<div class="btn" @click="sliceLeft(1)">右移</div>
				</div>
				<div class="ctrl-i">
					<div class="btn" @click="sliceTop(-1)">上移</div>
					<div class="value">{{computedValue.top}}</div>
					<div class="btn" @click="sliceTop(1)">下移</div>
				</div>
				<div class="ctrl-i">
					<div class="btn" @click="sliceSize(1,'width')">宽度+</div>
					<div class="value">{{computedValue.width}}</div>
					<div class="btn" @click="sliceSize(-1,'width')">宽度-</div>
				</div>
				<div class="ctrl-i">
					<div class="btn" @click="sliceSize(1,'height')">高度+</div>
					<div class="value">{{computedValue.height}}</div>
					<div class="btn" @click="sliceSize(-1,'height')">高度-</div>
				</div>
                <div class="ctrl-i">
					<div class="btn" @click="changRoate(1)">旋转+</div>
					<div class="value">{{computedValue.rotate}}</div>
					<div class="btn" @click="changRoate(-1)">旋转-</div>
				</div>
			
			</div>
			<div class="slicePic" v-show="isChange" :style="cutRect">
				<div class="cut">裁剪</div>
				<div class="upload" @click="uploadPic">修改图片</div>
				<div class="delete">删除</div>
			</div>
		</div>
		<div class="changeImg" v-show="isChangeImg">
			<div class="chang-img-wrap">
				<div class="wrap-body">
					<div class="close-change" @click="closeChangeImg">关闭</div>
					<div class="upload" @click="uploadPics">上传图片</div>
					<div class="change" @click="changePics">修改图片</div>
					<div class="change" @click="drawItems">确定</div>
					<div class="readerImg">
						<img :src="itemsFile" alt="" ref="readFile">
					</div>
					
				</div>
				<input type="file" name="" @change="getFiles" ref="uploadFiles"
				 accept=".jpg, .jpeg, .png"  style="display:none" >
			</div>
		</div>
		<div class="img-items">
			<div class="img-wrap" ref="imgWrap">
				<img src="../assets/bgs/aa.png" alt="" ref='img1'>
				<img src="../assets/bgs/aa.png" alt="" ref='img2'>
				<img src="../assets/bgs/aa.png" alt="" ref='img3'>
				<img src="../assets/bgs/aa.png" alt="" ref='img4'>
				<img src="../assets/bgs/aa.png" alt="" ref='img5'>
				<img src="../assets/bgs/aa.png" alt="" ref='img6'>
				<img src="../assets/bgs/aa.png" alt="" ref='img7'>
			</div>
		</div>
	</section>
</template>
<script>
	export default {
        name:'pageHome',
        data(){
            return {
                linkChange:'linkChange',
                isChangeImg:false,
                itemsFile:null,
                data:[{
                	width:60,
                	height:50,
                	top:8,
                    left:0,
                    rotate:0,
                	id:'imageone',
                	opcity:1,
                	pic:null
                },{
                	width:30,
                	height:70,
                	top:15,
                    left:65,
                    rotate:0,
                	id:'imagetwo',
                	opcity:1,
                	pci:null
                },{
                	width:40,
                	height:40,
                	top:58,
                    left:12,
                    rotate:0,
                	id:'imagethree',
                	opcity:1,
                	pci:null
                }],
                cvs:null,
                cparent:null,
                context:null,
                current:null,
                computedValue:{
                	width:0,
                	height:0,
                	top:0,
                    left:0,
                    opcity:1,
                    rotate:0
                },
                isChange:false,
                cutRect:{}
            }
        },
        mounted(){
        	this.init();
        },
        methods:{
        	closeChangeImg(){
        		this.isChangeImg=false;
				
        	},
			set_c_wh(){
				let _this=this;
				setTimeout(function(){
					let w=_this.cparent.clientWidth
				  	let h=_this.cparent.clientHeight
				  	_this.cvs.width=w
				  	_this.cvs.height=h
				  	_this.data.forEach(item=>{
				  		_this.insertPic(item)
				  	})
					let img=_this.$refs.img1
				  	_this.drawImg(img);
				},400)
			},
			//初始化画布
			init(){
				this.cvs=this.$refs.canvas
	        	this.cparent=this.$refs.canvaswrap
	        	this.context=this.cvs.getContext('2d')
	        	this.set_c_wh();
	        	
	        	let imgwrap=this.$refs.imgWrap
	        	let children=imgwrap.children
	        	imgwrap.style.width=(children[0].clientWidth+10)*children.length+'px'
			},
			//清除画布
			clearRect(){
				let w=this.cvs.width
				let h=this.cvs.height
				this.context.clearRect(0,0,w,h);
			},
			drawImg(img){
				let w=this.cvs.width
				let h=this.cvs.height
				this.context.drawImage(img,0,0,w,h)
			},
			drawAvard(data){
				let w=this.cvs.width*data.width/100
				let h=this.cvs.height*data.height/100
				let l=this.cvs.width*data.left/100
				let t=this.cvs.height*data.top/100
				let img=new Image()
				let p=this.getPosition(data)
				img.src=data.pic
				this.context.drawImage(img,p.l,p.t,img.width,img.height)
			},
			//插入空占位图
			insertPic(data){
				let w=this.cvs.width*data.width/100
				let h=this.cvs.height*data.height/100
				let l=this.cvs.width*data.left/100
				let t=this.cvs.height*data.top/100
				let addL=l+w/2
				let addT=t+h/2
				//画矩形
                this.context.beginPath()
                this.context.save()
                this.context.fillStyle="#ccc"
				this.context.rotate(Math.PI/180*data.rotate)
				if( !data.pic ){
					this.context.fillRect(l,t,w,h)
					//添加十字架
					this.context.strokeStyle="#4091DD"
					this.context.lineWidth="5"
					this.context.lineCap="round"
					this.context.moveTo(addL,addT-8)
					this.context.lineTo(addL,addT+8)
					this.context.stroke();
					this.context.moveTo(addL-8,addT)
					this.context.lineTo(addL+8,addT)
					this.context.stroke()
					this.context.restore()
				}else{
					this.drawAvard(data)
					this.context.restore()
				}
				
			},
			//获取当前图像载体
			getItems(e){
				let cx=e.pageX-this.cvs.offsetLeft
                let cy=e.pageY-this.cvs.offsetTop
				this.data.forEach((item,index)=>{
					let p=this.getPosition(item)
					if( cx>=p.l && cx<=p.l+p.w && cy>=p.t&& cy<=p.t+p.h ){
						this.current=item
						this.computPX(this.current)
						this.isChange=!this.isChange
						this.cutRect={
							left:p.l+this.cvs.offsetLeft+'px',
							top:p.t+'px'
						}
					}
				})
			},
			computPX(current){
				let value=this.getPosition(current)
				this.computedValue={
					width:value.w,
					height:value.h,
					left:value.l,
                    top:value.t,
                    opcity:current.opcity,
                    rotate:current.rotate
				}
			},
			//计算实际像素位置
			getPosition(cur){
				return {
					w:parseInt(this.cvs.width*cur.width/100),
					h:parseInt(this.cvs.height*cur.height/100),
					l:parseInt(this.cvs.width*cur.left/100),
                    t:parseInt(this.cvs.height*cur.top/100),
                    opcity:cur.opcity,
                    rotate:cur.rotate
				}
            },
            changePosition(value,name){
                let cur=this.current
                cur[name]=parseInt(cur[name]+value)
                this.isChange=false;
				let p=this.getPosition(cur)
				this.clearRect();
				this.data.forEach(item=>{
					this.insertPic(item)
				})
				let img=this.$refs.img1
				this.drawImg(img);
				this.computPX(cur)
				this.cutRect={
					left:p.l+'px',
					top:p.t+'px'
				}
            },
			//修改左右位置
			sliceLeft(value){
				if( this.current ===null) return 
				this.changePosition(value,'left')
			},
			sliceTop(value){
                if( this.current ===null) return 
               
				this.changePosition(value,'top')			
            },
            changRoate(value){
                if( this.current ===null) return 
                this.changePosition(value,'rotate')
            },
			sliceSize(value,name){
				if( this.current ===null){ return }
				let cur=this.current;
				let p=this.getPosition(cur)
                this.computPX(cur)
                this.clearRect();
				if( name ==='width'){
					cur.width+=value
				}else if(name==='height'){
					cur.height+=value
				}
				this.data.forEach(item=>{
					this.insertPic(item)
				})
				let img=this.$refs.img1
				this.drawImg(img);
				this.cutRect={
					left:p.l+'px',
					top:p.t+'px'
				}
            },
			uploadPic(){
				this.isChange=false;
				this.isChangeImg=true;
			},
			uploadPics(){
				let uploadFiles=this.$refs.uploadFiles;
				uploadFiles.dispatchEvent(new MouseEvent('click'));
			},
			getFiles(){
				let uploadFiles=this.$refs.uploadFiles;
				let fs=new FileReader()
				fs.onload=(e)=>{
					this.current.pic=e.target.result
					this.itemsFile=e.target.result
				}
				fs.readAsDataURL(uploadFiles.files[0])
			},
			changePics(){

			},
			drawItems(){
				let cur=this.current;
				let readFile=this.$refs.readFile
				let imgitems=readFile.src
				cur.pic=imgitems;
				this.clearRect();
				this.data.forEach(item=>{
					this.insertPic(item)
				})
				let img=this.$refs.img1
				this.drawImg(img)
			},
			getObjectURL(file) {
		        var url = null;
		        if (window.createObjectURL != undefined) {
		            url = window.createObjectURL(file)
		        } else if (window.URL != undefined) {
		            url = window.URL.createObjectURL(file)
		        } else if (window.webkitURL != undefined) {
		            url = window.webkitURL.createObjectURL(file)
		        }
		        return url
		    }

        }
    }
</script>
<style scoped lang="scss">
	.img-items{
		height:100px;
		position:absolute;
		bottom: 0;
		left:0;
		right:0;
		overflow-x:auto;
		.img-wrap{
			overflow: hidden;
			display: flex;
			img{
				width:100px;
				height:100px;
				display: block;
				margin:0 10px;
			}
		}
		
	}
	.xc-content{
		position:absolute;
		top:0;
		left:0;
		right:0;
		bottom:100;
		overflow-x:hidden;
	}
	.xc-wrap{
		width:750px;
		height:440px;
		border:1px solid #f00;
		margin:30px auto;
        background:#eee;
        box-sizing: border-box;
	}
	.canvas{
		box-sizing: border-box;
	}
	.ctrl{
		display:flex;
		flex-wrap:wrap;
		align-items:center;
		.ctrl-i{
			display: flex;
			align-items:center;
			justify-content:center;
			width:50%;
			margin-bottom:20px;
			background: #fff;
			box-sizing:border-box;
			>div{
				padding:10px 15px;
			}
			.btn{
				border:1px solid #f90;
				background: #fff;
				cursor: pointer;
				font-weight: 700;
				border-radius: 3px;
				background:#0099FF;
				color:#fff;
				font-size:30px;
			}
			.value{
				background:#fff;
				width:70px;
				text-align: center;
			}
		}
	}
	.slicePic{
		position:absolute;
		z-index:999;
		width:300px;
		height:65px;
		background:#000;
		color:#fff;
		display:flex;
		justify-content:center;
		align-items:center;
		border-radius: 5px;
		>div{
			display:flex;
			flex:1;
			text-align: center;
			align-items:center;
			justify-content:center;
			height:100%;
			&:active{
				background:#999;
			}
		}
	}
	.changeImg{
		position: absolute;
		z-index: 99;
		left: 0;
		top:0;
		right: 0;
		bottom:0;
		.chang-img-wrap{
			position: relative;
			background:rgba(0,0,0,.5);	
			height:100%;
			.wrap-body{
				padding:20px 30px;
				color:#000;
				text-align: center;
				>div{
					padding:20px 30px;
					border:1px solid #cecece;
					border-radius: 5px;
					color:#fff;
					font-size:34px;
				}
				.upload{
					position:relative;
					margin-top:430px;
					background:#093;
				}
				.change{
					margin-top:50px;
					background:#990000;
				}
				.close-change{
					width:70px;
					background:rgba(255,255,255,.5);
					position:absolute;
					right:10px;
					top:10px;
				}
			}
		}
	}
</style>