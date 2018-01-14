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
					<li v-for="(item,key) in dataList" 
						:key="key" 
						:class="{'active':active==item.id}" @click="goPath(item)">{{item.theme}}</li>
				</ul>
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
				dataList:[
					{theme:"相册1",id:1},
					{theme:"相册2",id:2},
					{theme:"相册3",id:3},
					{theme:"相册4",id:4},
					{theme:"相册5",id:5}
				],
				title:[],
				choiseTitle:"",
				active:null
			}
		},
		mounted(){
			this.getListData(2)
			let query=this.$route.query
			this.active=query.id
		},
		methods:{
			async getListData(params){
				let res = await getMyAlbList({id:params})
			},
			gotodraw(){
            	this.$router.push({ name:"index" })
        	},
			goPath(model){
				this.$router.push({name:"album",query:{id:model.id}})
			}
		},
		computed:{

		}
	}
</script>
<style scoped lang="scss">
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
					background:#fff;
					border:1px dashed #ccc;
					font-size:32px;
					margin:10px;
					&.active{
						background:#333;
						color:#fff;
					}
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