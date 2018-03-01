<template>
	<div class="test">
		<input type="file" name="" value="上传" ref="upload" @change="selectFileImage">
	</div>
</template>
<style scoped lang="scss">
	.test{
		color:#fff;
	}
</style>
<script>
	export default{
		mounted(){
			
		},
		methods:{
			selectFileImage(){
				let up=this.$refs.upload
				let file=up.files[0]
				let boble=this.createObjectURL(file)
				console.log(boble)
			},
			createObjectURL(blob){
    			return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
			}
		}
	}
</script>