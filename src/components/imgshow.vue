<template>
	<div class="draw-content">
		<div class="bgImg" ref="bgImg">
			<img :src="imgdata.bgImg" alt="" class="fade">
		</div>
		<div class="addText">
			<div class="item-text" 
				v-for="(item,key) in fontStyle" 
				:key="key"
				:style="{
					top:item.top,
					left:item.left,
					color:item.color,
					'font-size':item.relFontSize+'px',
					'font-weight':item.fontWeight
				}">
				{{ item.text }}
			</div>
		</div>
        <div class="avad-items" >
            <div class="avad-img" v-for="(item,key) in imgdata.list" 
				:key="key" 
				:style="{width:item.width+'%',
					height:item.height+'%',
					left:item.left+'%',
					top:item.top+'%',
					transform:'rotate('+item.rotate+'deg)',
				}" >
				<img v-if="item.pic" style="width:100%;height:100%"  :src="item.pic" >
            </div>
        </div>
	</div>
</template>
<script>
	export default {
		props:["imgdata"],
		data(){
			return{
				fontStyle:null
			}
		},
		mounted(){
			this.fontRealSize()
		},
		methods:{
			fontRealSize(){
				let cvsbg=this.$refs.bgImg
				let width=cvsbg.clientWidth
				let textList=[]
				this.imgdata.textList.forEach(item=>{
					let style={}
					for(let key in item.style){
						if( key==='relFontSize' ){
							style[key]=item.style.relFontSize*width
						}else{
							style[key]=item.style[key]
						}
					}
					style.text=item.text
					textList.push(style)
				})
				this.fontStyle=textList
			}
		}
	}
</script>
<style scoped lang="scss">
	.draw-content{
        position:relative;
		z-index:3;
		.bgImg{
			width:100%;
			height:100%;
			position:relative;
			z-index:5;
			>img{
				width:100%;
				display: block;
				border:none;
			}
		}
        .avad-img{
             position:absolute;
             color:rgb(43, 80, 247);
             font-size:24px;
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
			}
		}
    }
</style>