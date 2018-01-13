<template>
	<section class="get-user-list">
		<header id="header" class="header">
			<div class="gotodraw" @click="gotodraw">
				<span class="iconfont icon-prev"></span>
				<span>去制作</span>
			</div>
			<div class="title">
				我的相册列表
			</div>
		</header><!-- /header -->
		<section class="container">
			<div class="list-title">
				<ul>
					<li>相册标题</li>
					<li>相册标题</li>
					<li>相册标题</li>
					<li>相册标题</li>
					<li>相册标题</li>
					<li>相册标题</li>
				</ul>
			</div>
			<div class="list-cont">
					
			</div>
		</section>
		<footer>
			
		</footer>
	</section>
</template>
<script>
	import {getMyAlbList} from '../service/album'
	export default{
		data(){
			return{
				dataList:[],
				title:[],
				choiseTitle:""
			}
		},
		mounted(){
			this.getListData({id:2})
		},
		methods:{
			async getListData(params){
				let res = await getMyAlbList(params)
				console.log(res)
			},
			gotodraw(){
				console.log(1)
				this.$router.push({ name:"index" })
			}
		},
		computed:{

		}
	}
</script>
<style scoped lang="scss">
.get-user-list{
	background: #efefef;
	min-height: 100%;
}
	.header{
		padding:20px 15px;
		font-size:34px;
		text-align: center;
		background:#333;
		color:#fff;
		font-weight: 700;
		height:50px;
		position:relative;
		.gotodraw{
			float:left;
			display:flex;
			align-items:center;
			width:150px;
		}
		.title{
			display:flex;
			align-items:center;
			justify-content:center;
			text-align: center;
			position:absolute;
			left:50%;
			margin-left:-150px;
			width:300px;
		}
	}
	.container{
		background:transparent;
		padding:15px;
		margin-top:30px;
		.list-title{
			background:#fff;
			padding:10px 20px;
			>ul{
				list-style: none;
				>li{
					padding:10px 20px;
					display:inline-block;
					border:1px dashed #ccc;
					font-size:32px;
					margin:10px;
				}
			}
		}
		.list-cont{
			background:#fff;
			padding:10px 20px;
			margin-top:20px;
		}
	}
	
</style>