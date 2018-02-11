import config from './config.js'
//上传FormData
export const upload = formData => config.upload('/upload', formData)

//获取相册列表
export const getAlbum = params => config.get('/getalbum', params)

//上传相册集
export const uploadAlbums = params => config.postForm('/upusalbum', params)

//获取已做完的相册列表

export const getMyAlbList = params => config.get('/getusalbum', params)

//上传blob
export const uploadBolb = params => config.upload('/upbob', params)

//获取wx-js-sdk 权限
export const getSDK = params => config.post('http://tp.taodama.net/index.php?m=Mobile&c=Index&a=ajaxGetWxConfig&t=' + Math.random(), params)