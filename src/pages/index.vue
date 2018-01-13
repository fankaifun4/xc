<template>
    <section class="container">
        <header class="header">相册制作</header>
        <div class="dw-container">
            <div class="draw-content" ref="cvs"  @click="getItems" >
                <div class="bgImg" ref="cvsBackground">
					<img :src="data.bgImg" alt="" class="fade" ref="cvsBackgroundImg">
				</div>
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
							top:item.style.top,
							left:item.style.left,
							color:item.style.color,
							'font-size':item.style.fontSize+'px',
							'font-weight':item.style.fontWeight
						}"
						:value="item.text"
						:ischoise="choiseText==key"
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
						<img style="width:100%;height:100%" :id="item.id" :src="item.pic" ref="avadList">
                    </div>
                </div>
            </div>
        </div>
        <div class="onlodImage fade" ref="onloadImage"></div>
		<!-- canvas 预览 画图 -->
		<div class="preview-wrap" v-show="previewCVS">
			<div class='preview-cont'>
				<div class="preview-bg">
					<div class="preview-header">预览
						<input type="button" value="X" @click="previewCVS=false" class="close" name="">
					</div>
					<div class="preview-body">
						<canvas ref="tempCvas"></canvas>
					</div>
					<div class="saveOverPic">
						<div class="save-in-tpl" @click="saveToTpl">确定保存</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 设置插入图片微调modal -->
        <div class="ctrl" v-show="picItemCtrl">
        	<div class="titles">
        		<span>微调</span>
        		<div class="coloseCtrl" @click="closeCtrl">x</div>
        	</div>
        	<!-- 设置文字微调modal -->
			<div class="edit-text-ctrl" v-show="fontEdit">
				<div class="edit-text-header">文字位置请拖动文字</div>
				<div class="ctrl-i">
					<div class="btn" @click="setFontSize(1)">字体+</div>
	                <div class="value">{{textItems?textItems.style.fontSize:0}}</div>
	                <div class="btn"  @click="setFontSize(-1)">字体-</div>
				</div>
				<div class="ctrl-i">
					<div class="btn" @click="setFontWeight(1)">粗体</div>
	                <div class="value">{{textItems&&textItems.style.fontWeight==300?'细体':'粗体'}}</div>
	                <div class="btn"  @click="setFontWeight(0)">细体</div>
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
		<div class="saveImg" @click="preview">预览高清,并去保存当前相片</div>
		<div class="saveImg" @click="sendAllData">已完成相册，确定提交</div>
		<footer class="footer">
			<div class="img-items">
				<div class="img-wrap swiper-container swiper-container-horizontal" ref="imgWrap">
					<div class="swiper-wrapper">
						<div class="swiper-slide" v-for="(item,key) in tempData" :key="key">
							<img  :src="item.bgImg" :id="item.id" ref="temp_bg_elemts" alt=""  @click="drawBgImg(item)">
						</div>
					</div>
					<!-- Add Pagination -->
        			<div class="swiper-pagination"></div>
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
						<input class="getFiles" type="file" name="" 
						@change="getFiles" ref="uploadFiles"
						accept=".jpg, .jpeg, .png"  >
					</div>
					<div class="change" @click="changePics">修改图片</div>
					<div class="success" @click="drawItems">确定上传</div>
					<div class="lookload">预览</div>
					<div class="readerImg ">
						<img :src="itemsFile" alt="" ref="readFile">
					</div>
				</div>
				
			</div>
		</div>
		<!-- loading -->
        <loading v-show="isloading">
        	<div slot="loadingName">
        		{{ loadingCont }}
        	</div>
        </loading>
		<!-- 裁剪组件 -->
        <cut :aspectr="ratio" :class="isCut?'show':'hidden'" 
			@cancel="cancel" 
			@isload="isload"
			@closeload="closeload"
			@setCutImage="setCutImage"
			@showLoading='showLoading'
			:cutUrl="iscutUrl"></cut>
		<!-- 修改图片组件 -->
		<chiose v-show="choiseShow" @changeImgUrl="getChoiseImg" @hidden="getChoiseImghidden" ></chiose>
    </section>
</template>
<script>
    import cut from '@/components/cut'
	import loading from '@/components/loading'
	import chiose from '@/components/chiose'
	import colorPicker from '@/components/color-picker'
	import drawcvs from '@/mixins/draw-cvs'
	import Swiper from 'swiper'
	import {responseData} from './data.js'
	import {mapState,mapActions} from 'vuex'
	import {upload,getAlbum} from '../service/album'
	const collection= [{
		//背景
		bgImg:"static/bgc/aa.png",
		//列表单个ID
		id:"img_list_0",
		//主视图比例
		cvsRatio:10/7,
		//文字数据
		textList:[],
		//相片元素数据
		//除了opcity,rotate为实数，其他都为百分比
		list:[{
			width:40,
			height:30,
			top:10,
			left:10,
			rotate:0,
			id:'imageone',
			opcity:1,
			pic:"static/bgc/1.jpg",
			aspectRatio:9/3,
		}],
		
	}]

    export default{
        data(){
            return{
                name:'showIndex',
                //loading 开关
                isloading:false,
                //裁剪开关
                isCut:false,
                //裁剪的比例 16:9·4:3··
				ratio:1.777,
				//裁剪的图片Url
				iscutUrl:null,
				//选择图片开关
				choiseShow:false,
				//修改文字数组的健值
				choiseText:null,
				//编辑文字控制器开关
				fontEdit:false,
				//编辑图片元素控制器开关
				picItemCtrl:false,
				//加载相册模板列表
				tempData:[],
				//当前编辑的相片
                data:{},
                //计算长宽高偏移量控制台算数表达
                computedValue:{
                    width:0,
                    height:0,
                    top:0,
                    left:0,
                    opcity:1,
                    rotate:0
                },
                //裁剪，修改，删除，小控件开关
                isChange:false,
                //裁剪，修改，删除，小控件位置
                cutRect:{},
                //编辑区视图
                cvs:null,
                //当前选择的相册元素
                current:null,
				//修改上传组件开关
				isChangeImg:false,
				//缓存上传base64url
				itemsFile:null,
				//当前编辑的文字缓存
				textItems:null,
				//移动文字初始位置X
				entPageY:0,
				//移动文字初始位置Y
				entPageX:0,
				//颜色编辑器开关
				colorWrap:false,
				//预览canvas
				previewCVS:false,
				loadingCont:"正在初始化...",
				preImagesTpl:[],
				baseUrl:'http://tp.taodama.net/'
            }
		},
        components:{
			cut,
			loading,
			chiose,
			colorPicker
        },
        mounted(){
			this.getData()
        },
        computed:{
			...mapState(['imgId','imgUrl','imglist']),
			...mapActions(['setImg','getImg','getAll']),
        },
        methods:{
        	//init加载元素
        	async loadingImg(item){
        		let promise=new Promise((resolve,reject)=>{
        			let img = new Image()
        			img.src = item.bgImg
            		img.onload = () => {
            			this.loadingCont="正在加载:相框"+item.id
            			resolve(img)
            		}
            		img.onError=()=>{
            			this.loadingCont="正在加载:相框"+item.id+'失败'
            			reject()
            		}
		            img.onerror = reject
		        })
		        return promise
        	},
        	async preImages(list){
        		this.preImagesTpl=[]
        		let isload=[]
				list.forEach(item=>{
					let pro=this.loadingImg(item)
							.then(img=>this.preImagesTpl.push(img))
							.catch(e=> console.log(err))
					isload.push(pro)
				})
				return new Promise((resolve,reject)=>{
					Promise.all(isload).then(()=>{
    					resolve(true)
    				})
				})
        		
        	},
        	async getData(){
        		this.isloading=true
        		this.loadingCont="正在初始化请稍后..."
				let res=await getAlbum({id:1})
        		this.loadingCont="数据初始化完成，正在加载素材"
        		let theme=res.data.theme;
        		let data=res.data.list
        		let loadbg=await this.preImages(data)
        		this.loadingCont="背景图片加载完成"
        		this.tempData=data
        		this.loadingCont="正在渲染相册结构..."
		  		this.initDrawView()
        		var swiper = new Swiper('.swiper-container', {
			        pagination: '.swiper-pagination',
			        slidesPerView: 3,
			        paginationClickable: true,
			        spaceBetween: 15,
			        paginationType: 'fraction',
			        preloadImages: true,
			        observer:true,
			    });
        	},
        	//初始化
            initDrawView(){
                //初始化画布大小
				this.cvs=this.$refs.cvs;
				if(this.tempData.length>0){
					this.data=this.tempData[0]
				}
				this.cvs.style.height=parseInt(this.cvs.clientWidth/this.data.cvsRatio)+'px'
				let cvsBackground=this.$refs.cvsBackground
				cvsBackground.style.background="url("+this.data.bgImg+") no-repeat center"
				cvsBackground.style.backgroundSize="100%";
				this.loadingCont="相册结构渲染完成..."
				this.isloading=false
				this.loadingCont=""
			},
			//获取修改传过来的url
			getChoiseImg(url){
				this.current.pic=url
			},
			//获取当前图像载体
			getItems(e){
				let cx=e.pageX-this.cvs.parentNode.offsetLeft
                let cy=e.pageY-this.cvs.parentNode.offsetTop
				let cutRectDom=this.$refs.cutRectDom
				this.data.list.forEach((item,index)=>{
					let p=this.getPosition(item)
					if( cx>=p.l && cy>=p.t && cx<=p.l+p.w && cy<=p.t+p.h ){
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
			//loading start
			isload(){
				this.isloading=true
			},
			//loading end
			closeload(){
				this.isloading=false
			},
			//获取裁剪后的图片地址
			setCutImage(url){
				console.log(url)
				this.current.pic=this.baseUrl+url
			},
			showLoading(value){
				console.log(value)
				this.isloading=value
			},
			//关闭修改图片组件
			closeChangeImg(){
				this.isChange=false
        		this.isChangeImg=false
        	},
			//高清预览并画成图片
            preview(){
				let canvas=this.$refs.tempCvas
				let drawBox=this.$refs.cvs
				let drawBoxWidth=drawBox.clientWidth;
				let drawBoxHeight=drawBoxWidth/this.data.cvsRatio;
				canvas.width=drawBoxWidth
				canvas.height=drawBoxHeight
				let drawData=this.data
				let avadList=this.$refs.avadList
				let cvsBackgroundImg=this.$refs.cvsBackgroundImg
				
				drawcvs.init(canvas,avadList,cvsBackgroundImg,drawData)
				this.previewCVS=true;
				
		    },
            uploadPic(){
				this.isChange=false
				this.isChangeImg=true
			},
			//获取上传图片blob
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
			//打开修改图片组件
			getChoiseImghidden(){
				this.choiseShow=false
			},
			//打开裁剪图片组件
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
			//删除图片
			deletePic(){
				let cur=this.current
				if( !cur.pic ) return
				cur.pic=""
				this.isChange=false
			},
			//关闭裁剪
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
            //修改旋转角度
            changRoate(value){
                this.changePosition(value,'rotate')
			},
			//修改大小
			sliceSize(value,name){
				if( !this.current) return 
				if( !this.current.pic ) return
				
				let cur=this.current
				let p=this.getPosition(cur)
                this.computPX(cur)
				if( name ==='width'){
					cur.width=parseInt(cur.width+value)
				}else if(name==='height'){
					cur.height=parseInt(cur.height+value)
				}
				this.cutRect={
					left:p.l+'px',
					top:p.t+'px'
				}
            },
			//主操作区添加背景图片
			drawBgImg(model){
				this.data=model
				let cvsBackground=this.$refs.cvsBackground
				let cvs=this.$refs.cvs
				let viweWidth=cvsBackground.clientWidth
				let img=new Image()
				img.src=model.bgImg;
				if( img.complete ){
					let pw=viweWidth/img.width
					cvs.style.height=img.height*pw+'px'
					cvsBackground.style.background="url("+this.data.bgImg+") no-repeat center"
					cvsBackground.style.backgroundSize="100% 100%"
					return
				}else{
					img.onload=function(){
						let pw=viweWidth/img.width
						cvs.style.height=img.height*pw+'px'
						cvsBackground.style.background="url("+this.data.bgImg+") no-repeat center"
						cvsBackground.style.backgroundSize="100% 100%"
					}
					return
				}
			},
			//获取input files 对象的bolob路径
    		 getFileUrl(soure) {
		        var url;
		        if (navigator.userAgent.indexOf("MSIE") >= 1) { // IE 
		            url = soure.value;
		        } else if (navigator.userAgent.indexOf("Firefox") > 0) { // Firefox 
		            url = window.URL.createObjectURL(soure.files[0]);
		        } else if (navigator.userAgent.indexOf("Chrome") > 0) { // Chrome 
		            url = window.URL.createObjectURL(soure.files[0]);
		        }
		        return url;
		    },
			//上传图片
			async drawItems(){
				this.isloading=true
				let cur=this.current
				let uploadFiles=this.$refs.uploadFiles
				if( !uploadFiles.files[0] ) return
				if(uploadFiles.files[0].size>1024*1024*4) {
					alert('图片必须小于4M')
					return
				}
				let blobImg=this.getFileUrl(uploadFiles)
				let bob=uploadFiles.files[0]
				let file=new FormData()
				file.append('file',bob)
				let resData=await upload(file)
				this.isloading=false
				let url="http://tp.taodama.net/"
				url+=resData.img
				cur.pic=url
				cur.itemBlob=blobImg
				this.isChangeImg=false
				this.$store.dispatch('setImg',url)
			},
			//添加文字
			addTextBtn(){
				let addText=this.$refs.addText
				this.data.textList.push({
					style:{
						left:'0px',
						top:'0px',
						color:'#ffff00',
						fontSize:24,
						fontWeight:300
					},
					text:"请在此输入文字"
				})
			},
			//获取文字域
			getTextItems(e,item,key){
				e.cancelBubble = true;
				let cur=e.currentTarget;
				this.choiseText=key
				this.textItems=item
				this.picItemCtrl=true
				this.fontEdit=true
			},
			//获取文字初始位置
			getMoveText(e,item,key){
				let cvs=this.$refs.cvs.parentNode
				let cur=e.currentTarget;
				this.entPageX = e.changedTouches[0].pageX - cvs.offsetLeft-cur.offsetLeft;
				this.entPageY = e.changedTouches[0].pageY - cvs.offsetTop-cur.offsetTop;
			},
			//移动文字
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
			//编辑完成
			endEdit(e,item,key){
				item.isDrap=false
				let cur=e.currentTarget
				if(cur.value==''){
					this.data.textList.splice(key,1)
					this.textItems=null;	
				}
				item.text=cur.value
			},
			//修改颜色
			changeColor(value){
				this.colorWrap=false
				if(!this.textItems) return
				this.textItems.style.color=value
			},
			//关闭颜色组件
			cancelColor(){
				this.colorWrap=false
			},
			//打开颜色组件开关
			changeTextColor(){
				this.colorWrap=true
			},
			//设置文字大小
			setFontSize(value){
				this.textItems.style.fontSize=parseInt(this.textItems.style.fontSize)+value
			},
			//设置文字字体粗细
			setFontWeight(value){
				if(value ){
					this.textItems.style.fontWeight=700
				}else{
					this.textItems.style.fontWeight=300
				}
			},
			//关闭控制台
			closeCtrl(){
				this.picItemCtrl=false
			},
			//保存到相册列表视图
			saveToTpl(){
				let cvs=this.$refs.tempCvas;
				let ctx=cvs.getContext('2d')
				if(!this.data.id) return
				let temp_bg=this.$refs.temp_bg_elemts
				let DataId=this.data.id
				let base64Data=cvs.toDataURL('image/png')
				if(temp_bg.length>0){
					temp_bg.forEach(item=>{
						if( item.id== DataId){
							item.src=base64Data
							this.previewCVS=false
						}
					})
				}
			},
			sendAllData(){
				let isOver=[]
				this.tempData.forEach((item,index)=>{
					let bgList={
						index:'',
						done:false
					}
					item.list.forEach(img=>{
						bgList.done=!img.pic?false:true
						bgList.index=index
					})
					isOver.push(bgList)
				})
				let imgIndex=[]
				isOver.forEach(item=>{
					if(!item.done){
						imgIndex.push(item.index+1)
					}
				})
				console.log(this.tempData)
				let uid=1;
				let id=1;
				let jsondata = JSON.stringify( this.tempData ) 
				let sendData={
					uid:uid,
					id:id,
					jsondata:jsondata
				}
				if(imgIndex.length>0){
					let alertIndex=imgIndex.toString()
					let isNext=confirm('还有第'+alertIndex+'张未设置完成，需要继续设置照片吗？')
					if(isNext){
						// this.$http({
						// 	method:"POST",
						// 	url:'http://tp.taodama.net/mobile/photo/upusalbum',
						// 	data:{
						// 		firstName:"Fred",
						// 		lastName:"Flintstone"
						// 	}
						// })
					}else{
						return
					}
				}else{
					let isUplod=confirm('确定要上传所有主题相册吗？')
					if(isUplod){
						console.log('toSend')
					}else{
						return;
					}
				}

			}
        }     
    }
</script>
<style lang="scss" scoped>
	@import "../style/swiper.scss";
	@import "../style/modal.scss";
	.chiose-text{
		border:2px dashed #f90 !important;
		box-sizing: border-box;
	}
	.header{
		padding:20px 15px;
		font-size:34px;
		text-align: center;
	}
    .container{
        width:100%;
        height:100%;
    }
    .dw-container{
        width:100%;
        border:1px dashed rgb(21, 194, 6);
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
				border:none;
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
		.img-wrap{
			.swiper-pagination{
				background: rgba(0,0,0,.5);
				color:#fff;
			}
			img{
				border:1px solid #ccc;
				padding:10px;
				width:100%;
				display: block;
				box-sizing:border-box;
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
		border-radius: 4px 4px 0 0;
		.titles{
			width:100%;
			text-align: center;
			border-bottom:1px solid #ccc;
			padding:15px;
			font-size:32px;
			background:#286090;
			color:#fff;
			border-color: #204d74;
			margin-bottom:15px;
			position:relative;
			.coloseCtrl{
				color:#fff;
				background:transparent;
				text-align: center;
				padding:0 15px;
				font-size:32px;
				position:absolute;
				display:inline-block;
				right:0;
				top:0;
			}
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
		position: fixed;
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
		display:flex;
		flex-wrap: wrap;
		.edit-text-footer{
			width:100%;
		}
		.change-text-color{
			font-size:32px;
			background:#f90;
			padding:15px;
			color:#fff;
			margin-bottom: 10px;
		}
		.edit-text-header{
			font-size:32px;
			color:#f20;
			width:100%;
			margin-bottom: 10px;
		}
	}
	.footer{
		margin-top:30px;
	}
	
</style>
