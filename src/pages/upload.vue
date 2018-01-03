<template>
  <div>
      <header @click="goPath">
          添加完成
      </header>
      upload
  </div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{
            goPath(){
                this.$router.push({name:'pagehome'})
            }
        }
    }
</script>
<style>

</style>
