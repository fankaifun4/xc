import Vue from 'vue'
Vue.directive('drag', {
    inserted(el, binding) {
        let self = this; //上下文
        el.onmousedown = function(e) {
            //鼠标按下，计算当前元素距离可视区的距离
            let disX = e.clientX - el.offsetLeft;
            let disY = e.clientY - el.offsetTop;
            document.onmousemove = function(e) {
                console.log(1)
                    //通过事件委托，计算移动的距离 
                let l = e.clientX - disX;
                let t = e.clientY - disY;
                //移动当前元素  
                el.style.left = l + 'px';
                el.style.top = t + 'px';
                //将此时的位置传出去
                binding.value({ x: e.pageX, y: e.pageY })
            };
            document.onmouseup = function(e) {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

    }
});