import * as type from './type'
export default {
    [type.SETIMG]: (state, url) => {

        if (!localStorage.getItem('imglist')) {
            localStorage.setItem('imglist', '[]')
        }
        let lists = JSON.parse(localStorage.getItem('imglist'))
        let newAr = [];

        function isSame(item) {
            return item == url
        }
        lists.forEach(item => {
            newAr.push(item)
        })
        if (newAr.some(isSame)) return
        newAr.push(url)
        let insertAr = JSON.stringify(newAr)
        localStorage.setItem('imglist', insertAr)
        state.imglist = newAr
    },
    [type.GETIMG]: (state, url) => {
        state.imgUrl = url
    },
    [type.SETCUTIMG]: (state, url) => {
        state.cutImg = url
    }
}