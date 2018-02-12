import * as type from './type'
export default {
    [type.SETIMG]: (state, localImg) => {
        function isSame(item) {
            return item == localImg
        }
        if (state.imglist.some(isSame)) return
        state.imglist.push(localImg)
    },
    [type.GETIMG]: (state, url) => {
        state.imgUrl = url
    },
    [type.SETCUTIMG]: (state, url) => {
        state.cutImg = url
    }
}