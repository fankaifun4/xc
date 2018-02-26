<template>
	<section>
		<div v-for="(item,key) in prevlist" :key="key">
			<img :src="item.pic" alt="">
		</div>
	</section>
</template>
<style>
	
</style>
<script>
	export default {
		props:['prevlist'],
		mounted(){

		},
		methods:{

		}
	}
</script>