import * as type from './type'
export default {
    setImg: function({ commit }, url) {
        commit(type.SETIMG, url)
    },
    getImg: function({ commit }, index) {
        commit(type.GETIMG, index)
    },
    setCutImg: function({ commit }, url) {
        commit(type.SETCUTIMG)
    }
}