<template>
	<div class="choise-color-wrap">
		<div class='choise-color-body'>
			<div class="choise-color-header">
				选择颜色
			</div>
			<div class="get-color">
				<div  v-for="(item,key) in colorList" 
					:key="key" 
					:style="{background:'#'+item}"
					@click="setColorfn(item)">
				</div>
			</div>
			<div class="set-color" :style="{background:choiseColor}"></div>
			<div class="set-color-ctrl">
				<input type="button" name="" @click="emitColor" value="确定">
				<input type="button" name="" @click="cancelColor" value="取消">
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		data(){
			return {
				colorList:[],
				choiseColor:"#000000"
			}
		},
		mounted(){
			this.setColor()
		},
		computed:{
		},
		methods:{
			setColor(){
				let tempColorList=[];
				let li=['00','33','66','99','aa','bb','cc','ff']
				let red=['ff','00','00']
				let green=['00','ff','00']
				let blue=['00','00','ff']
				let redar=setElColor(red,li)
				let greenar=setElColor(green,li)
				let bluear=setElColor(blue,li) 
				let tt1=new Set(redar);	
				let tt2=new Set(greenar);
				let tt3=new Set(bluear);
				let contant=[...tt1,...tt2,...tt3]
				let contt=[...new Set(contant)]
				function setElColor(color,li){
					let ar=[]
					for(let k=0;k<color.length;k++){
						let colorSelect=0
						if( color[k]=='ff' ) {
							colorSelect=k
						}
						for(let i=colorSelect;i<li.length;i++){
							let _index=li[i]
							color[k]=_index
							let strings=color.toString().replace(/,/ig,'')
							ar.push(strings)
						}
					}
					return ar
				}
				this.colorList=contt
			},
			setColorfn(item){
				this.choiseColor='#'+item
				
			},
			emitColor(){
				this.$emit('changeColor',this.choiseColor)
			},
			cancelColor(){
				this.$emit('cancelColor')
			}
		}
	}
</script>
<style scoped lang='scss'>
	.choise-color-wrap{
		position: fixed;
		left: 0;
		bottom: 0;
		right: 0;
		top: 0;
		z-index: 500;
		background: rgba(0,0,0,.5)
	}
	.choise-color-body{
		position:relative;
		width:690px;
		top:10%;
		margin:auto;
		background:#fff;
		border:1px solid #ccc;
		border-radius: 5px;
		.choise-color-header{
			border-bottom:1px solid #333;
			padding:10px 25px;
			font-size:32px;
			text-align: center;
		}
		.get-color{
			display: flex;
			flex-wrap:wrap;
			padding:10px 15px;
			border-top:1px solid #096;
			>div{
				width:60px;
				height:60px;
				display:inline-block;
			}
		}
		.set-color{
			height:60px;
			margin:10px 0;
			border:1px solid #999;
			border-left:0;
			border-right:0;
			background:#000;
		}
		.set-color-ctrl{
			display:flex;
			align-items:center;
			justify-content:center;
			margin-bottom:10px;
			>input{
					border:1px solid #ccc;
					padding:15px 30px;
					margin:0 20px;
					color:#fff;
					background:#090;
			}
		}
	}
</style>