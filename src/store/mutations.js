import * as type from './type'
export default {
    [type.SETIMG]: (state, url) => {
        function isSame(item) {
            return item == url
        }
        if (state.imglist.some(isSame)) return
        state.imglist.push(url)
    },
    [type.GETIMG]: (state, url) => {
        state.imgUrl = url
    },
    [type.SETCUTIMG]: (state, url) => {
        state.cutImg = url
    }
}