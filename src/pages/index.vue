<template>
    <section class="container" ref="container">
        <header class="header">
        	<span class="header-title">
        		相册制作
        	</span>
        	<span class="fr" @click="goMylist">
        		我的相册<span class="iconfont icon-you"></span>
        	</span>
        </header>
        <div class="error" v-if="error">网络连接错误</div>
        <div v-if="!error">
	        <div class="dw-container" >
				<div class="iconfont icon-prev left swiper-button-prev" ref="swiperLeft" @click="prev"></div>
				<div class="iconfont icon-you right swiper-button-next" ref="swiperRight" @click="next"></div>
	            <div class="draw-content"  :class="[animation?'opac1':'opac0']" ref="cvs"  @click="getItems" >
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
							placeholder="请输入文字"
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
							<img v-if="item.pic" style="width:100%;height:100%" :id="item.id" :src="item.pic" ref="avadList">
	                    </div>
	                </div>
	            </div>
	        </div>
	        <div class="onlodImage fade" ref="onloadImage"></div>
	        <div class="img-prev-list">
	        	<section class="prev-list-items" ref="prevlistitems">
					<div v-for="(item,key) in iconlist" :key="key" class="items" >
						<div class="delete-list-items" v-if="item.pic" 
							@click="deleteItems(item,key)">
		        			<div class="iconfont icon-close"></div>
		        		</div>
						<div class="item-add" v-if="!item.pic" @click="addImgLists(item)">
							<div class="shu"></div>
							<div class="heng"></div>
						</div>
						<img v-if="item.pic" :src="item.pic" alt="">
					</div>
				</section>
	        </div>
			<!-- 设置插入图片微调modal -->
	        <div class="ctrl" v-show="picItemCtrl" >
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
	        <div class="ctrl-alumb-wrap" >
	        	<div class="saveImg" @click="addTextBtn">添加文字</div>
				<div class="saveImg" @click="sendAllData">已完成相册，确定提交</div>
	        </div>
			<footer class="footer">
				<div class="img-items">
					<div class="img-wrap swiper-container swiper-container-horizontal" ref="imgWrap">
						<div class="swiper-wrapper">
							<div class="swiper-slide" :class="{'active':isActive==key}" v-for="(item,key) in tempData" :key="key">
								<img  :src="item.bgImg" :id="item.id" ref="temp_bg_elemts" alt=""  @click="drawBgImg(item,key)">
								<div class="items-footer">
									<div class="avad-img" v-for="(item,key) in item.list" 
									:key="key" 
									:style="{width:item.width+'%',
										height:item.height+'%',
										left:item.left+'%',
										top:item.top+'%',
										transform:'rotate('+item.rotate+'deg)',
										}" >
				                        <div v-if="!item.pic" class="iconfont icon-jia3"></div>
										<img v-if="item.pic" style="width:100%;height:100%" :id="item.id" :src="item.pic" ref="avadList">
				                    </div>
								</div>
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
	            <div class="upload" @click="uploadPic">{{hasImg?"替换图片":"添加图片"}}</div>
	            <div class="delete" @click="deletePic">删除</div>
	        </div>
			<!-- loading -->
	        <loading v-show="isloading">
	        	<div slot="loadingName">
	        		{{ loadingCont }}
	        	</div>
	        </loading>
			<!-- 裁剪组件 -->
	        <cut :aspectr="ratio" :class="[isCut?'show':'hidden']" 
				@cancel="cancel" 
				@isload="isload"
				@closeload="closeload"
				@setCutImage="setCutImage"
				@showLoading='showLoading'
				:cutUrl="iscutUrl"></cut>
		</div>
    </section>
</template>
<script>
    import cut from '@/components/cut'
	import loading from '@/components/loading'
	import colorPicker from '@/components/color-picker'
	import drawcvs from '@/mixins/draw-cvs'
	import Swiper from 'swiper'
	import {mapState,mapActions} from 'vuex'
	import {upload,getAlbum,uploadAlbums,getSDK} from '../service/album'
	const reloadimg=require('../../static/bg.png')
	const isIOS = () => {
  		return /iPhone|iPad|iPod/i.test(navigator.userAgent)
	}
    export default{
        data(){
            return{
            	error:false,
                name:'showIndex',
                //loading 开关
                isloading:true,
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
				baseUrl:'http://tp.taodama.net/',
				swiper:null,
				animation:true,
				isActive:0,
				user_id:null,
				modelId:null,
				goods_id:null,
				//微信接口
				wxSDK:null,
				//选择的图片列表
				localIds:null,
				//选择本地图片转成的base64
				localData:[],
				//保存当前图片index
				tempImgIndex:0,
				//第N次批量上传
				uploadIndex:0,
				//相册items缓存
				iconlist:[],
				hasImg:false,
				//兼容IOS预览显示
				iosImgPrev:[],
				//slide-width
				textslide:0,
				//wx下载到本地图片列表
				downloadWXImgId:[],
				//wx上传到服务器图片列表
				uploadWXImgId:[]
            }
		},
        components:{
			cut,
			loading,
			colorPicker,
        },
        mounted(){
			this.init()
			
        },
        computed:{
			isIOS(){
				return /iPhone|iPad|iPod/i.test(navigator.userAgent)
			}
        },
        methods:{
			async init(){
				let url= window.encodeURIComponent(location.href.split('#')[0]) 
				let res=await getSDK({ askUrl:url })
				this.initSdk(res,(wx)=>{
					this.wxSDK=wx
					this.getData()
                })				
			},
			goMylist(){
				window.location=window.location.origin+"/mobile/User/photo_list.html"
			},
			prev(){
				if(this.swiper.isBeginning) return
				this.current=null
				this.isChange=false
				let cvs=this.$refs.cvs
				this.animation=false
				setTimeout(()=>this.animation=true,200)
				this.swiper.slidePrev()
				let index=this.swiper.realIndex
				this.data=this.tempData[index]
				this.isActive=index
				this.drawBgImg(this.data,index)
				
			},
			next(){
				if(this.swiper.isEnd) return;
				this.current=null
				this.isChange=false
				let cvs=this.$refs.cvs
				this.animation=false
				setTimeout(()=>this.animation=true,200)
				this.swiper.slideNext()
				let index=this.swiper.realIndex
				this.data=this.tempData[index]
				this.isActive=index
				this.drawBgImg(this.data,index)
			},
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
							.catch(e=> e)
					isload.push(pro)
				})
				return new Promise((resolve,reject)=>{
					Promise.all(isload).then(()=>{
    					resolve(true)
    				}).catch(()=>{
    					reject(false)
    				})
				})
        		
        	},
        	async getData(){
        		this.isloading=true
        		this.loadingCont="正在初始化请稍后..."
        		if(!this.$route.query.id){
        			// alert('您还没有登录，请登陆后重试')
        			this.error=true
        			this.isloading=false
        			return
        		}
        		this.modelId=this.$route.query.id
				this.goods_id=this.$route.query.goods_id

				let res=await getAlbum({id:this.modelId})
				if( !res.code ){
					this.error=true
					this.isloading=false
					return
				}
				if( !res.user_id || res.user_id=='0' ){
					alert('您还没有登录，请登陆后重试')
					this.error=true
					this.isloading=false
        			return
				}else{
					this.user_id=res.user_id
				}
        		this.loadingCont="数据初始化完成，正在加载素材"
        		let theme=res.data.theme;
        		let data=res.data.list
        		let loadbg=await this.preImages(data)
        		this.loadingCont="背景图片加载完成"
        		this.tempData=data
				this.loadingCont="正在渲染相册结构..."
				this.tempData.forEach(item=>{
					item.list.forEach(list=>{
						this.iconlist.push(list)
					})
				})
				
				//设置预览wrap宽度
				let prevlistitems=this.$refs.prevlistitems
				let len=this.iconlist.length
				prevlistitems.style.width=len*2+(len-1)*0.15+'rem'
				setTimeout(()=>{
					 this.swiper	=new Swiper('.swiper-container', {
					 	loop : false,
						pagination:'.swiper-pagination',
						paginationType : 'fraction',
						spaceBetween: 15,
						observer:true,
					});
					this.initDrawView()

				},0)
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
			
			getDomWidthOrHeight(widthOrHeight,obj){
				var clone=obj.cloneNode(true);
				clone.style.display="block";
				clone.style.position="absolute";
			　　clone.style.top='-10000px';
				obj.parentNode.appendChild(clone);
				var width=clone.offsetWidth;
				var height=clone.offsetHeight;
				obj.parentNode.removeChild(clone);
				return widthOrHeight=="width"?width:height;    
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
						this.iscutUrl=reloadimg

						//判断当前item 是否已存在图片
						this.hasImg=(item.pic&&item.pic!="")?true:false
						this.computPX(this.current)
						this.isChange=!this.isChange
						let width=this.getDomWidthOrHeight('width',cutRectDom)
						let pleft=this.cvs.offsetLeft+width+p.l;
						let cwidth=this.$refs.container.clientWidth;
						if( pleft>cwidth ){
							pleft=cwidth-width-10
						}else{
							pleft=p.l+this.cvs.offsetLeft
						}
						this.cutRect={
							left:pleft+'px',
							top:p.t+30+'px'
						}
					}
				})
				this.picItemCtrl=true;
				
			},
			//删除相册图片
			deleteItems(model,index){
				this.iconlist[index].pic=""
				this.iconlist[index].isDelete=true
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
				if(!url) {
					alert("上传失败,请检查网络是否畅通")
					this.isloading=false
					return
				}
				this.current.pic=url
				this.itemsFile=url
				this.isCut=false
				this.isChangeImg=false
				this.isloading=false
			},
			showLoading(value){
				this.isloading=value
			},
			//关闭修改图片组件
			closeChangeImg(){
				this.isChange=false
        		this.isChangeImg=false
        	},
        	addImgLists(model){
        		this.current=model
        		this.getFiles()
        	},
            uploadPic(){
            	this.iscutUrl=reloadimg
				this.localIds=null
				this.iosImgPrev=[]
				this.getFiles()
			},
			//获取上传图片blob
			getFiles(){
				const _this=this
				this.localIds=null
				this.iosImgPrev=[]
				let imgItems=0
				if(this.current.isDelete){
					this.wxSDK.chooseImage({
	                    count: 1,
	                    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
	                    // sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
	                    success: function (res) {
	                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							_this.localIds = res.localIds;
							_this.uploadImg()
						},
						fail:function(er){
							alert(er)
						}
	                })
	                return;
				}
				if(this.hasImg){
					this.wxSDK.chooseImage({
	                    count: 1,
	                    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
	                    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
	                    success: function (res) {
	                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							_this.localIds = res.localIds;
							_this.uploadImg()
						},
						fail:function(er){
							alert(er)
						}
	                })
				}else{
					this.iconlist.forEach((item,index)=>{
						if( item.pic ) return
						if(imgItems<9){
							imgItems++
						}else{
							imgItems=9
						}
					})
					this.wxSDK.chooseImage({
	                    count: imgItems,
	                    sizeType: ['original'], // 可以指定是原图还是压缩图，默认二者都有
	                    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
	                    success: function (res) {
	                        // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
							_this.localIds = res.localIds;
							_this.uploadImg()
						},
						fail:function(er){
							alert(er)
						}
	                })
				}
				let cur=this.current
				this.ratio=cur.aspectRatio
			},
			//获取微信选择的本地图片
			uploadImg(){
				const _this=this;
				this.isloading=true
				//如果是删除了图片则只进行替换
				if( this.current.isDelete  ){
					
					_this.wxSDK.getLocalImgData({
						localId:_this.localIds[0],
						success:function(res){
							let data=res.localData
							if( isIOS() ){
								data=res.localData.replace(/data:image\/jgp/,'data:image/jpeg')
								_this.$set(_this.current,'pic',data)
							}else{
								_this.$set(_this.current,'pic','data:image/jpeg;base64,'+data)
							}
							_this.isloading=false
						},
						fail:function(er){
							alert(er)
						}
					})
					this.closeChangeImg()
					return
				}

				//如果已有图片则替换
				if(this.hasImg){
					
					_this.wxSDK.getLocalImgData({
						localId:_this.localIds[0],
						success:function(res){
							let data=res.localData
							if( isIOS() ){
								data=res.localData.replace(/data:image\/jgp/,'data:image/jgeg')
								_this.$set(_this.current,'pic',data)
							}else{
								_this.$set(_this.current,'pic','data:image/jpeg;base64,'+data)
							}
							_this.isloading=false
						},
						fail:function(er){
							alert(er)
						}
					})
				}else{
					//否则遍历添加
					let index=0;
					//tempImgIndex
					// 当前第几次上传
					this.uploadIndex+=1;
					__getImaData(index)
					function __getImaData(_index){
						//递归结束
						if(_index>=_this.localIds.length) {
							_this.isloading=false

							//记录当前第几张照片
							_this.tempImgIndex-=_index

							//执行设置图片路径
							_this.setImgIndexUrl()
							return
						}

						_this.wxSDK.getLocalImgData({
							localId:_this.localIds[_index],
							success:function(res){
								_index++
								_this.tempImgIndex+=1
								let data=res.localData
								_this.localData.push(data);
								//开始递归获取图片地址
								__getImaData(_index)
							},
							fail:function(er){
								alert(er)
							}
						})
					}
				}
				//关闭选择图片组件
				this.closeChangeImg()	
			},

			//这是图片路径
			setImgIndexUrl(){
				let index=0
				if(this.uploadIndex>1){
					index=this.tempImgIndex
				}
				this.iconlist.forEach((item,_index)=>{
					if( item.pic ) return
					if( this.uploadIndex>1 && _index<index ) return
					if(  _index==this.iconlist.leng-1 ){
						this.isloading=false
					}
					if( _index>this.localData.length-1 ) return
					if( isIOS() ){
						let data=this.localData[_index].replace(/data:image\/jgp/,'data:image/jgeg')
						this.$set(this.iconlist[_index],'pic',data)
					}else{
						this.$set(this.iconlist[_index],'pic','data:image/jpeg;base64,'+this.localData[_index])	
					}
					index++
				})
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
		        }else{
		        	url = window.URL.createObjectURL(soure.files[0]);
		        }
		        return url;
			},
			
			//修改图片
			changePics(){
				this.isChangeImg=false
			},

			//打开裁剪图片组件
            cutPic(){
            	let _this=this
				let cur=this.current
				let cvs=this.$refs.tempCvas
				let id=cur.id
				let img=document.querySelector('#'+id)
				this.isloading=true
				if( !cur.pic ){
					alert('没有裁剪的图片，请先添加图片')
					this.isChange=false
					this.isloading=false
					return
				}
		        img.src=cur.pic
		        _this.iscutUrl=cur.pic
		        if( img && !img.complete ){
					alert("请等待相册元素加载完成")
					this.isloading=false
					return
				}
				if(!_this.iscutUrl) {
					alert('没有裁剪的图片，请先添加图片')
					this.isChange=false
					this.isloading=false
					return
				}
				_this.ratio=cur.aspectRatio
				_this.isCut=true
				_this.isChange=false
				_this.isloading=false
			},
			//删除图片
			deletePic(){
				let cur=this.current
				if( !cur.pic ) return
				cur.pic=""
				cur.isDelete=true
				this.isChange=false
			},

			//关闭裁剪
            cancel(){
				this.isCut=false
				this.closeChangeImg()
				this.deletePicUrl()
            },

            //清空上传图片，预览图片路径
            deletePicUrl(){
            	this.itemsFile=null
            	this.iscutUrl=reloadimg
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

			drawBgImg(model,key){
				this.data=model
				this.isChange=false
				let cvsBackground=this.$refs.cvsBackground
				let cvs=this.$refs.cvs
				let viweWidth=cvsBackground.clientWidth
				let img=new Image()
				img.src=model.bgImg;
				this.animation=false
				this.isActive=key
				setTimeout(()=>{
					this.animation=true
				},200)
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

			//添加文字
			addTextBtn(){
				let addText=this.$refs.addText
				let currentCVS=this.$refs.cvs
				let textSize=parseInt(currentCVS.clientWidth/24)
				this.data.textList.push({
					style:{
						left:'0',
						top:'0',
						color:'#f00',
						fontSize:textSize,
						fontWeight:300,
						relFontSize:textSize/currentCVS.clientWidth
					},
					text:"在此修改您的文字"
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
				let currentCVS=this.$refs.cvs
				let cur=e.currentTarget
				let pageX=e.changedTouches[0].pageX-cvs.offsetLeft
				let pageY=e.changedTouches[0].pageY-cvs.offsetTop
				cur.style.left=parseInt(pageX-this.entPageX)/currentCVS.clientWidth*100+'%'
				cur.style.top=parseInt(pageY-this.entPageY)/currentCVS.clientHeight*100+'%'
				item.style.left=cur.style.left
				item.style.top=cur.style.top
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
				let currentCVS=this.$refs.cvs
				this.textItems.style.fontSize+=value
				this.textItems.style.relFontSize=this.textItems.style.fontSize/currentCVS.clientWidth
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
			sendAllData(){
				this.isloading=true
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
				
				let jsondata = this.tempData 
				let formData=new FormData()
				formData.append('user_id',this.user_id)
				formData.append('id',this.modelId)
				formData.append('goods_id',this.goods_id)
				formData.append('jsondata',JSON.stringify(jsondata))
				if(imgIndex.length>0){
					let alertIndex=imgIndex.toString()
					let isNext=confirm('还有第'+alertIndex+'张未设置完成，暂时将当前相册保存到服务器？')
					if(isNext){
						this.uploadAlums(formData)
					}else{
						this.isloading=false
						return
					}
				}else{
					let isUplod=confirm('确定要上传所有主题相册吗？')
					if(isUplod){
						this.uploadAlums(formData)
					}else{
						this.isloading=false
						return;
					}
				}

			},
			async uploadAlums(params){
				let res=await uploadAlbums(params)
				if(res && res.code){
					alert("提交成功")
					this.isloading=true;
					window.location=window.location.origin+"/mobile/photo/route?user_id="+this.user_id+'&goods_id='+this.goods_id+'&id='+this.modelId
				}else{
					this.isloading=false;
					alert("提交失败")
				}
			},
			overHidden(value){
				let app=document.getElementById('app')
        		if(value){
        			app.style.height="100%"
        			app.style.overflow='hidden'
        		}else{
        			app.style.height=""
        			app.style.overflow='scroll'
        		}
			}
        },
        watch:{
        	isloading(prev,old){
        		this.overHidden(prev)
        	},
        	isChangeImg(prev,old){
        		this.overHidden(prev)
        	},
        	isCut(prev,old){
        		this.overHidden(prev)
        	},
        	previewCVS(prev,old){
        		this.overHidden(prev)
        	}
        }    
    }
</script>
<style lang="scss" scoped>
	@import "../style/swiper.scss";
	@import "../style/modal.scss";
	.img-prev-list{
		margin:0 15px;
		overflow-x: scroll;
		height:260px;
		box-sizing: border-box;
	}
	.prev-list-items{
		margin-top:35px;
		position: relative;
		.items{
			position: relative;
			width:200px;
			height:200px;
			float:left;
			margin-right:15px;
			box-sizing:border-box;
			border-radius: 3px;
			background:#ccc;
			.delete-list-items{
				position: absolute;
				right:-40px;
				top:-40px;
				width:80px;
				height:80px;
				z-index:10;
				>div{
					width:100%;
					height:100%;
					color:#fff;
					font-size:66px;
				}
			}
			>.item-add{
				position:absolute;
				top:0;
				bottom:0;
				left:0;
				right:0;
				>div{
					position:absolute;
					left:50%;
					top:50%;
					background:#090;
				}
				.heng{
					width:50px;
					height:10px;
					margin-top:-5px;
					margin-left: -25px;
				}
				.shu{
					width:10px;
					height:50px;
					margin-top:-25px;
					margin-left: -5px;
				}
			}
			>img{
				width:100%;
				height:100%;
				z-index:1;
			}
		}
		.items:last-child{
			margin-right:0;
		}
	}
	.error{
		position:fixed;
		left: 0;
		top:105px;
		right:0;
		bottom:0;
		background:#666;
		color:#fff;
		display:flex;
		align-items:center;
		justify-content:center;
		z-index:999;

	}
	.swiper-slide{
		background:#ccc;
		&.active{
			border:3px solid #f00;
			box-sizing: border-box
		}
	}
	
	.chiose-text{
		border:2px dashed #f90 !important;
		box-sizing: border-box;
	}

	
	.header{
		padding:30px 25px;
		font-size:42px;
		text-align: center;
		color:#fff;
		font-weight: 700;
		background:#333;
		.header-title{
			width:300px;
			display:inline-block;
			margin-left:150px;
		}
	}
    .container{
        width:100%;
    }
    .dw-container{
        padding:25px;
        box-sizing: border-box;
		position:relative;
		min-height:300px;
		.left,.right{
			width:80px;
			height:80px;
			position: absolute;
			top:50%;
			background:#204d74;
			color:#fff;
			z-index: 70;
			text-align: center;
			line-height: 80px;
			margin-top:-40px;
		}
		.left{
			left:0;
		}
		.right{
			right:0;
		}
    }
    .draw-content{
        position:relative;
        width:100%;
        height:100%;
		overflow:hidden;
		border:2px dashed #000;
		background:#ccc;
		transition: all .2s;
		z-index:3;
		&.opac0{
			opacity: 0;
		}
		&.opac1{
			opacity: 1;
		}
		.bgImg{
			width:100%;
			height:100%;
			position:absolute;
			z-index:5;
		}
        .avad-img{
             position:absolute;
             color:rgb(43, 80, 247);
             font-size:36px;
			 display: flex;
			 justify-content: center;
			 align-items: center;
			 z-index:4;
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
	.ctrl-alumb-wrap{
		padding:15px;
	}
	.saveImg{
		padding:15px;
		background:#e30;
		color:#fff;
		box-sizing:border-box;
		border-radius: 1px;
		margin:10px auto;
		text-align: center;
		font-size:30px;
	}
	.img-items{
		width:35%;
		margin:auto;
		.img-wrap{
			width:100%;
			&.swiper-container{
				overflow: visible;
			}
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
		margin:15px;
		border:1px solid #ccc;
		border-radius: 4px 4px 0 0;
		background:#fff;
		.titles{
			width:100%;
			text-align: center;
			border-bottom:1px solid #ccc;
			padding:25px;
			font-size:32px;
			background:#333;
			color:#fff;
			border-color: #204d74;
			margin-bottom:25px;
			position:relative;
			.coloseCtrl{
				color:#fff;
				background:transparent;
				text-align: center;
				padding:0 25px;
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
				background: #333;
				border:1px solid #333;
				border-radius: 1px;
				color:#fff;
				font-size:30px;
				width:105px;
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
		width:400px;
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
					height:60px;
					border:1px solid #cecece;
					color:#fff;
					font-size:44px;
				}
				.readerImg{
					margin-top:10px;
					padding:0;
					background:#ccc;
					min-height:300px;
					>img{
						width:100%;
						display: block;
					}
				}
				.getFiles{
					width:100%;
					height:80px;
					display:block;
					background:#093;
					color:#fff;
					border:none;
					font-size:32px;
					margin-top:80px;
					background:#090;
					border:1px solid #fff;
				}
				.setFiles{
					width:100%;
					height:80px;
					display:block;
					background:#093;
					color:#fff;
					border:none;
					font-size:32px;
					margin-top:30px;
					background:#090;
					border:1px solid #fff;
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
				.change{
					width:100%;
					height:80px;
					margin:20px 0;
					display:block;
					font-size: 32px;
					background:#900;
					color:#fff;
					border:1px solid #fff;
				}
				.close-change{
					width:90px;
					height:60px;
					line-height:40px;
					position:absolute;
					right:10px;
					top:10px;
					background:#fff;
					color:#000;
					padding:10px 15px;
					border:none;
				}
				.img-prev{
					display:flex;
					flex-wrap:wrap;
					flex-direction:center;
					border:none;
					.img-prev-wrap{
						width:20%;
						margin:10px 20px;
						>img{
							display: block;
							border:none;
							width:100%;
						}
					}
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
			background:#333;
			padding:15px;
			color:#fff;
			width:200px;
			
			margin:auto;
			margin-bottom: 10px;
		}
		.edit-text-header{
			font-size:32px;
			color:#f20;
			width:100%;
			margin-bottom: 10px;
			background:#fff;
		}
	}
	.footer{
		width:100%;
		box-sizing:border-box;
		overflow-y:hidden;
		&.opac0{
			opacity: 0;
		}
		&.opac1{
			opacity: 1;
		}
		.bgImg{
			width:100%;
			height:100%;
			position:absolute;
			z-index:5;
		}
        .avad-img{
             position:absolute;
             color:rgb(43, 80, 247);
             font-size:36px;
			 display: flex;
			 justify-content: center;
			 align-items: center;
			 z-index:4;
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
</style>
