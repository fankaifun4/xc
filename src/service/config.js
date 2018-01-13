import axios from 'axios'
axios.defaults.baseURL = 'http://tp.taodama.net/mobile/photo'
axios.defaults.timeout = 60000;

const get = function(url, params={}) {
    let query = params || {}
    return axios.get(url, { params: {...query } }).then(res => res.data).catch(error => error)
}

const post = function(url, params={}) {
    let query = params || {}
    return axios.post(url, query).then(res => res.data).catch(err => err)
}

const upload = function(url, formData={}) {
    let FormData = formData || {}
    return axios.post(url, FormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res =>  res.data).catch(err =>  err)
}

const postForm=function(url,params={}){
    return axios.post(url,params,{
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' }
    }).then(res=>res.data).catch(err=>err)
}

export default {
    get,
    post,
    upload,
    postForm
}