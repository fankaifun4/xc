import config from './config.js'
//上传FormData
export const upload = formData => config.upload('/upload', formData)

//获取相册列表
export const getAlbum = params => config.get('/getalbum', params)
    // /upbob
    // let ImgBase64=canvas.toDataURL("image/png")
    // let image=new Image()
    // image.src=ImgBase64
    // drawcvs.draw(drawData)
    // var image = new Image()
    // var data = this.cvs.toDataURL("image/png")
    // var file = new FormData()
    // file.append('file', data)
    // this.$http.post('/upbob',file,{
    // 		headers:{'Content-Type':'multipart/form-data'}
    // 	}
    // )
    // .then(function(res){
    // 	console.log(res)
    // })
    // .catch(function(er){
    // 	console.log(er)	
    // })
    // return image