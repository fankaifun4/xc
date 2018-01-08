<template>
    <section class="container">
        <header class="header">相册制作</header>
        <div class="dw-container">
            <div class="draw-content" ref="cvs"  @click="getItems" >
                <div class="bgImg" ref="cvsBackground"></div>
				<div class="addText" ref="addText">
					<input class="item-text" 
						:class="{'chiose-text':choiseText==key}" 
						v-for="(item,key) in data.textList" 
						:key="key" 
						@click="getTextItems($event,item,key)"
						@touchstart="getMoveText($event,item,key)"
						@touchmove="dragText($event,item,key)"
						@blur="endEdit($event,item,key)"
						:style="{
							let:item.style.left,
							top:item.style.top,
							color:item.style.color,
							fontSize:item.style.fontSize
						}"
						:value="item.text"
						:ischoise="choiseText==key"
						contenteditable='plaintext-only'
						/>
				</div>
				
                <div class="avad-items" >
                    <div class="avad-img" v-for="(item,key) in data.list" 
					:key="key" 
					:style="{width:item.width+'%',
						height:item.height+'%',
						left:item.left+'%',
						top:item.top+'%',
						transform:'rotate('+item.rotate+'deg)',
						}" >
                        <div v-if="!item.pic" class="iconfont icon-jia3"></div>
						<img style="width:100%;height:100%" :src="item.pic">
                    </div>
                </div>
            </div>
        </div>
        <div class="onlodImage fade" ref="onloadImage"></div>
		<div class="fade">
			<canvas ref="tempCvas"></canvas>
		</div>
        
		
		
		<!-- 设置插入图片微调modal -->
        <div class="ctrl" v-show="picItemCtrl">
        	<div class="titles">微调</div>
        	<!-- 设置文字微调modal -->
			<div class="edit-text-ctrl" v-show="fontEdit">
				<div class="edit-text-header">文字位置请拖动文字</div>
				<div class="ctrl-i">
					<div class="btn">字体+</div>
	                <div class="value">{{computedValue.left}}</div>
	                <div class="btn">字体-</div>
				</div>
				<div class="edit-text-footer">
					<div class="change-text-color" @click="changeTextColor">修改文字颜色</div>
	                <colorPicker 
	                	@cancelColor="cancelColor" 
	                	@changeColor="changeColor" 
	                	v-show="colorWrap">
	                </colorPicker>
				</div>
			</div>
            <div class="ctrl-i">
                <div class="btn" @click="sliceLeft(-1)">左移-</div>
                <div class="value">{{computedValue.left}}</div>
                <div class="btn" @click="sliceLeft(1)">右移+</div>
            </div>
            <div class="ctrl-i">
                <div class="btn" @click="sliceTop(-1)">上移+</div>
                <div class="value">{{computedValue.top}}</div>
                <div class="btn" @click="sliceTop(1)">下移-</div>
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
                <div class="btn" @click="changRoate(-1)">旋转+</div>
                <div class="value">{{computedValue.rotate}}</div>
                <div class="btn" @click="changRoate(1)">旋转-</div>
            </div>
        </div>
		<div class="saveImg" @click="addTextBtn">添加文字</div>
		<div class="saveImg" @click="saveImage">保存</div>
		<footer>
			<div class="img-items">
				<div class="img-wrap" ref="imgWrap">
					<img v-for="(item,key) in backImages" :key="key"
					 :src="item" alt="" ref='img1' @click="drawBgImg(item)">
				</div>
			</div>
		</footer>
	<!-- Modals -->	
        <div class="slicePic" v-show="isChange" :style="cutRect" ref="cutRectDom">
            <div class="cut" @click="cutPic">裁剪</div>
            <div class="upload" @click="uploadPic">修改图片</div>
            <div class="delete" @click="deletePic">删除</div>
        </div>
		<!-- 修改，上传 dom  -->
		<div class="changeImg" v-show="isChangeImg">
			<div class="chang-img-wrap">
				<div class="wrap-body">
					<div class="close-change" @click="closeChangeImg">关闭</div>
					<div class="upload">上传图片
						<input class="getFiles" type="file" name="" @change="getFiles" ref="uploadFiles"
				 accept=".jpg, .jpeg, .png"  >
					</div>
					<div class="change" @click="changePics">修改图片</div>
					<div class="success" @click="drawItems">确定上传</div>
					<div class="lookload">预览</div>
					<div class="readerImg">
						<img :src="itemsFile" alt="" ref="readFile">
					</div>
				</div>
				
			</div>
		</div>
        
        <loading v-show="isloading"></loading>
        <cut :aspectr="ratio" :class="isCut?'show':'hidden'" 
			@cancel="cancel" 
			@isload="isload"
			@closeload="closeload"
			@setCutImage="setCutImage"
			:cutUrl="iscutUrl"></cut>
		<chiose v-show="choiseShow" @changeImgUrl="getChoiseImg" @hidden="getChoiseImghidden" ></chiose>
        
    </section>
</template>
<script>
    import cut from '@/components/cut'
	import loading from '@/components/loading'
	import chiose from '@/components/chiose'
	import colorPicker from '@/components/color-picker'
	import {mapState,mapActions} from 'vuex'
    export default{
        data(){
            return{
                name:'showIndex',
                isloading:false,
                isCut:false,
				ratio:1.777,
				iscutUrl:null,
				choiseShow:false,
				choiseText:null,
				colorList:"#f00",
				fontEdit:false,
				picItemCtrl:false,
				backImages:[
					"http://localhost:8080/static/bgc/aa.png",
					"http://localhost:8080/static/bgc/aa.png",
					"http://localhost:8080/static/bgc/aa.png"
				],
                data:{
					bgImg:"http://localhost:8080/static/bgc/aa.png",
					textList:[],
					list:[{
						width:60,
						height:50,
						top:10,
						left:10,
						rotate:0,
						id:'imageone',
						opcity:1,
						pic:"http://localhost:8080/static/bgc/1.jpg",
						aspectRatio:4/3,
					},{
						width:30,
						height:70,
						top:15,
						left:65,
						rotate:15,
						id:'imagetwo',
						opcity:1,
						pic:"http://localhost:8080/static/bgc/2.jpg",
						aspectRatio:9/16,
					},{
						width:40,
						height:40,
						top:58,
						left:12,
						rotate:0,
						id:'imagethree',
						opcity:1,
						pic:"",
						aspectRatio:16/9,
					}]
				},
                computedValue:{
                    width:0,
                    height:0,
                    top:0,
                    left:0,
                    opcity:1,
                    rotate:0
                },
                isChange:false,
                cutRect:{},
                bgImg:null,
                cvs:null,
                current:null,
				cvsRatio:10/7,
				isChangeImg:false,
				itemsFile:null,
				textItems:null,
				entPageY:0,
				entPageX:0,
				colorWrap:false
            }
        },
        components:{
			cut,
			loading,
			chiose,
			colorPicker
        },
        mounted(){
			this.initDrawView()
        },
        computed:{
			...mapState(['imgId','imgUrl','imglist']),
			...mapActions(['setImg','getImg','getAll']),
        },
        methods:{
            initDrawView(){
                //初始化画布大小
				this.cvs=this.$refs.cvs;
                this.cvs.style.height=parseInt(this.cvs.clientWidth/this.cvsRatio)+'px'
                let imgwrap=this.$refs.imgWrap
	        	let children=imgwrap.children
				imgwrap.style.width=(children[0].clientWidth+10)*children.length+'rem'
				let cvsBackground=this.$refs.cvsBackground
				cvsBackground.style.background="url("+this.data.bgImg+") no-repeat center"
				cvsBackground.style.backgroundSize="100%"
			},
			//获取修改传过来的url
			getChoiseImg(url){
				this.current.pic=url
			},
			//获取当前图像载体
			getItems(e){
				let cx=e.pageX-this.cvs.offsetLeft
                let cy=e.pageY-this.cvs.offsetTop
				let cutRectDom=this.$refs.cutRectDom
				this.data.list.forEach((item,index)=>{
					let p=this.getPosition(item)
					if( cx>=p.l && cx<=p.l+p.w && cy>=p.t&& cy<=p.t+p.h ){
						this.current=item
						this.computPX(this.current)
						this.isChange=!this.isChange
						this.cutRect={
							left:p.l+this.cvs.offsetLeft+'px',
							top:p.t+15+'px'
						}
					}
				})
				this.picItemCtrl=true;
			},
			isload(){
				this.isloading=true
			},
			closeload(){
				this.isloading=false
			},
			//获取裁剪后的图片地址
			setCutImage(base64Url){
				this.current.pic=base64Url
			},
			closeChangeImg(){
				this.isChange=false
        		this.isChangeImg=false
        	},
			//保存成图片
            saveImage(){
		    	var image = new Image()
		    	var data = this.cvs.toDataURL("image/png")
				var file = new FormData()
                file.append('file', data)
                this.$http.post('/api/upbob',file,{
						headers:{'Content-Type':'multipart/form-data'}
					}
				)
				.then(function(res){
					console.log(res)
				})
				.catch(function(er){
					console.log(er)	
				})
				return image
		    },
            uploadPic(){
				this.isChange=false
				this.isChangeImg=true
			},
			getFiles(){
				let uploadFiles=this.$refs.uploadFiles
				let fs=new FileReader()
				fs.onload=(e)=>{
					this.itemsFile=e.target.result
				}
				fs.readAsDataURL(uploadFiles.files[0])
			},
			//修改图片
			changePics(){
				this.isChangeImg=false
				this.choiseShow=true
			},
			getChoiseImghidden(){
				this.choiseShow=false
			},
            cutPic(){
				let cur=this.current
				let cvs=this.$refs.tempCvas
				this.iscutUrl=cur.pic
				if(!cur.pic) {
					alert('没有裁剪的图片，请先添加图片')
					this.isChange=false
					return
				}
				this.ratio=cur.aspectRatio
				this.isCut=true
				this.isChange=false
			},
			deletePic(){
				let cur=this.current
				if( !cur.pic ) return
				cur.pic=""
				this.isChange=false
			},
            cancel(){
				this.isCut=false
            },
            //计算显示位置
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
					w:parseInt(this.cvs.clientWidth*cur.width/100),
					h:parseInt(this.cvs.clientHeight*cur.height/100),
					l:parseInt(this.cvs.clientWidth*cur.left/100),
                    t:parseInt(this.cvs.clientHeight*cur.top/100),
                    opcity:cur.opcity,
                    rotate:cur.rotate
				}
            },
			//改变位置
            changePosition(value,name){
				if( !this.current ) return 
				if( !this.current.pic ) return
                let cur=this.current
                cur[name]=parseInt(cur[name]+value)
                this.isChange=false
				let p=this.getPosition(cur)
				this.computPX(cur)
				this.cutRect={
					left:p.l+'px',
					top:p.t+'px'
				}
            },
			//修改位置
			sliceLeft(value){
				this.changePosition(value,'left')
			},
			sliceTop(value){
				this.changePosition(value,'top')			
            },
            changRoate(value){
                this.changePosition(value,'rotate')
			},
			//修改大小
			sliceSize(value,name){
				if( !this.current.pic ) return
				if( this.current ===null){ return }
				let cur=this.current
				let p=this.getPosition(cur)
                this.computPX(cur)
				if( name ==='width'){
					cur.width+=value
				}else if(name==='height'){
					cur.height+=value
				}
				this.cutRect={
					left:p.l+'px',
					top:p.t+'px'
				}
            },
            //插入空占位图
			insertPic(data){
				let p=this.getPosition(data)
                this.computPX(data)
			},
			drawBgImg(url){
				this.data.bgImg=url
				let cvsBackground=this.$refs.cvsBackground
				cvsBackground.style.background="url("+this.data.bgImg+") no-repeat center"
				cvsBackground.style.backgroundSize="100%"
			},
			drawItems(){
				let _this=this
				let cur=this.current
				let uploadFiles=this.$refs.uploadFiles
				if( !uploadFiles.files[0] ) return
				if(uploadFiles.files[0].size>1024*1024*2) {
					alert('图片必须小于2M')
					return
				}
				let bob=uploadFiles.files[0]
				let file=new FormData()
				file.append('file',bob)
				_this.isloading=true
				this.$http.post('/api/upload',file,{
						headers:{'Content-Type':'multipart/form-data'}
					}
				)
				.then(function(res){
					let data=res.data
					let url="http://tp.taodama.net/"
					if(data.code){
						_this.isloading=false
						url+=data.img
						cur.pic=url
						_this.isChangeImg=false
						_this.$store.dispatch('setImg',url)
					}
				})
				.catch(function(er){
					console.log(er)
					_this.isloading=false
				})
			},
			addTextBtn(){
				let addText=this.$refs.addText
				this.data.textList.push({
					style:{
						left:'0px',
						top:'0px',
						color:'#ffff00',
						fontSize:'24px'
					},
					text:"请在此输入文字"
				})
			},
			getTextItems(e,item,key){
				e.cancelBubble = true;
				let cur=e.currentTarget;
				this.choiseText=key
				this.textItems=item
				this.picItemCtrl=true
				this.fontEdit=true

			},
			getMoveText(e,item,key){
				let cvs=this.$refs.cvs.parentNode
				let cur=e.currentTarget;
				this.entPageX = e.changedTouches[0].pageX - cvs.offsetLeft-cur.offsetLeft;
				this.entPageY = e.changedTouches[0].pageY - cvs.offsetTop-cur.offsetTop;
			},
			dragText(e,item,key){
				e.preventDefault(); 
				let cvs=this.$refs.cvs.parentNode
				let cur=e.currentTarget
				let pageX=e.changedTouches[0].pageX-cvs.offsetLeft
				let pageY=e.changedTouches[0].pageY-cvs.offsetTop
				cur.style.left=parseInt(pageX-this.entPageX)+'px'
				cur.style.top=parseInt(pageY-this.entPageY)+'px'
				item.style.left = cur.style.left
				item.style.top = cur.style.top
			},
			endDrag(e,item,key){
				item.isDrap=false
			},
			endEdit(e,item,key){
				item.isDrap=false
				let cur=e.currentTarget
				if(cur.value==''){
					this.data.textList.splice(key,1)	
				}	
				item.text=cur.value
			},
			changeColor(value){
				this.colorWrap=false
				this.textItems.style.color=value
			},
			cancelColor(){
				this.colorWrap=false
				
			},
			changeTextColor(){
				this.colorWrap=true
			}
        }     
    }
</script>
<style lang="scss" scoped>
	.chiose-text{
		border:2px dashed #f90;
		box-sizing: border-box;
	}
	.header{
		padding:10px 15px;
		font-size:34px;
		text-align: center;
		margin-bottom:20px;
	}
    .container{
        width:100%;
        height:100%;
    }
    .dw-container{
        width:100%;
        border:2px dashed rgb(21, 194, 6);
        box-sizing: border-box;
        background:#fff;
        position:relative;
    }
    .draw-content{
        position:relative;
        width:100%;
        height:100%;
		overflow:hidden;
		.bgImg{
			width:100%;
			height:100%;
			position:absolute;
			z-index:300;
		}
        .avad-img{
             position:absolute;
             color:rgb(43, 80, 247);
             font-size:24px;
			 display: flex;
			 justify-content: center;
			 align-items: center;
			 z-index:100;
 			 >div{
				 font-size:64px;
			 }
			 >img{
				 width:100%;
				 display:block;
				 border:none;
				 position: absolute;
				 top:0;
			 }
        }
		.addText{
			position: absolute;
			z-index:400;
			background:transparent;
			box-sizing: border-box;
			top:0;
			left: 0;
			right:0;
			bottom:0;
			.item-text{
				position: absolute;
				display: inline-block;
				width:100%;
				font-size:32px;
				color:#ff0;
				background:transparent;
				outline:none;
				// user-modify: read-write-plaintext-only;
			}
		}
    }
    
    .fade{
		display: none
	}
	.hidden{
		visibility: hidden;
	}
	.show{
		visibility: visible
	}
	.saveImg{
		padding:15px 20px;
		background:#090;
		color:#fff;
		box-sizing:border-box;
		border-radius: 5px;
		margin:10px 30px;
		text-align: center;
		font-size:40px;
	}
	.img-items{
		height:240px;
		bottom: 20px;
		overflow-x:auto;
		overflow-y:hidden;
		.img-wrap{
			img{
				border:1px solid #ccc;
				padding:10px;
				float: left;
				width:240px;
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
		width:100%;
		height:440px;
		border:1px solid #f00;
		margin:30px auto;
        background:#eee;
        box-sizing: border-box;
	}
	
	.ctrl{
		display:flex;
		flex-wrap:wrap;
		align-items:center;
		margin:35px;
		border:1px solid #ccc;
		border-radius: 15px 15px 0 0;
		.titles{
			width:100%;
			text-align: center;
			border-bottom:1px solid #ccc;
			padding:15px;
			margin-bottom:15px;
			font-size:32px;
		}
		.ctrl-i{
			display: flex;
			align-items:center;
			justify-content:center;
			width:50%;
			margin-bottom:20px;
			background: #fff;
			box-sizing:border-box;
			font-size:32px;
			>div{
				padding:8px 7px;
			}
			.btn{
				background: #286090;
				border-color:#204d74;
				border-radius: 3px;
				color:#fff;
				font-size:30px;
				width:100px;
				text-align: center;
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
		z-index:400;
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
		z-index:400;
		left: 0;
		top:0;
		right: 0;
		bottom:0;
		.chang-img-wrap{
			position: relative;
			background:rgba(0,0,0,.5);	
			height:100%;
			overflow-y:auto;
			height:100%;
			
			.wrap-body{
				padding:20px 30px;
				color:#000;
				text-align: center;
				>div{
					padding:20px 15px;
					border:1px solid #cecece;
					border-radius: 5px;
					color:#fff;
					font-size:34px;
				}
				.readerImg{
					margin-top:10px;
					padding:0;
					border-radius: 0;
					background:#fff;
					>img{
						width:100%;
						display: block;
					}
				}
				.getFiles{
					width:100%;
					height:100%;
					display:block;
					position:absolute;
					left:0;
					top:0;
					right:0;
					bottom:0;
					opacity:0;
				}
				.success{
					margin-top:50px;
					background:#990000;
				}
				.lookload{
					margin-top:30px;
					border-radius: 0;
					background:#fff;
					color:#333;
				}
				.upload{
					position:relative;
					margin-top:100px;
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
	.edit-text-ctrl{
		font-size:32px;
		width:100%;
		text-align: center;
	}
	.change-text-color{
		font-size:32px;
		background:#f90;
		padding:15px;
		color:#fff;
	}
</style>
