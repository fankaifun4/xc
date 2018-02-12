import * as type from './type'
export default {
    setImg: function({ commit }, localImg) {
        commit(type.SETIMG, localImg)
    },
    getImg: function({ commit }, index) {
        commit(type.GETIMG, index)
    },
    setCutImg: function({ commit }, url) {
        commit(type.SETCUTIMG)
    }
}