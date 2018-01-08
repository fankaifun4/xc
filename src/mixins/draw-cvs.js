export default {
    avadItem: [],
    tempImg: [],
    listImg: [],
    cvs: null,
    ctx: null,
    bckground: null,
    init(cvs, imglist, bg, data) {
        //存入数据
        this.cvs = cvs
        this.bckground = bg
        this.ctx = this.cvs.getContext('2d')
        this.cvs.style.border = "2px solid #f00"
        this.cvs.style['box-sizing'] = 'border-box'
        let cvsHeight = cvs.height
        let cvsWidth = cvs.width
        let templObj = {}
        data.list.forEach(item => {
                templObj = {}
                for (let key in item) {
                    templObj['width'] = cvsWidth * item.width / 100
                    templObj['height'] = cvsHeight * item.height / 100
                    templObj['top'] = cvsHeight * item.top / 100
                    templObj['left'] = cvsWidth * item.left / 100
                    templObj['rotate'] = Math.PI / 180 * item.rotate
                    templObj['id'] = item.id
                    templObj['opcity'] = item.opcity
                    templObj['aspectRatio'] = item.aspectRatio
                    templObj['pic'] = item.pic
                    for (let i = 0; i < imglist.length; i++) {
                        if (templObj.id == imglist[i].id) {
                            templObj['img'] = imglist[i]
                        }
                    }
                }
                this.listImg.push(templObj)
            })
            //开始画图
        this.initDraw()
    },
    drawAVAD(item) {
        this.ctx.beginPath()
        this.ctx.save()
        this.ctx.translate(0, 0)
        let addL = item.left + item.width / 2
        let addT = item.top + item.height / 2
        let rx = -addL + item.left
        let ry = -addT + item.top
        this.ctx.translate(addL, addT)
        this.ctx.rotate(item.rotate)
        this.ctx.drawImage(item.img, rx, ry, item.width, item.height)
        this.ctx.restore();
    },
    drawBG() {
        this.ctx.beginPath()
        this.ctx.save()
        this.ctx.translate(0, 0)
        this.ctx.drawImage(this.bckground, 0, 0, this.cvs.width, this.cvs.height)
        this.ctx.restore();
    },
    drawText() {

    },
    initDraw() {
        let empty = []
        this.listImg.forEach(item => {
            if (item.img.src.match(/.jpg|.png|.jpeg/)) {
                empty.push(item)
            }
        })
        this.avadItem = empty
        this.avadItem.forEach(item => {
            this.drawAVAD(item)
        })
        this.drawBG()
    }
}