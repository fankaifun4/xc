import axios from 'axios'
axios.defaults.baseURL = 'http://tp.taodama.net/mobile/photo'
axios.defaults.timeout = 60000;

const get = function(url, params) {
    let query = params || {}
    return axios.get(url, { params: {...query } }).then(res => {
        return res.data;
    }).catch(error => {
        return error
    })
}

const post = function(url, params) {
    let query = params || {}
    return axios.post(url, query).then(res => {
        return res.data;
    }).catch(err => {
        return err
    })
}

const upload = function(url, formData) {
    let FormData = formData || {}
    return axios.post(url, FormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
        return res.data
    }).catch(err => {
        return err
    })
}

export default {
    get,
    post,
    upload
}