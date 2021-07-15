import Vue from 'vue'
// 可拖拽dialog 兼容ie版本
Vue.directive('dialogDrag', {
  bind(el, binding, vnode, oldVnode) {
    const dialogHeaderEl = el.querySelector('.el-dialog__header')
    const dragDom = el.querySelector('.el-dialog')
    dragDom.style.top = '0px'
    dragDom.style.left = '0px'
    dialogHeaderEl.style.cursor = 'move'
    const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)
    //拖拽的代码
    dialogHeaderEl.onmousedown = (e) => {
      var e = event || window.event //兼容
      e.preventDefault ? e.preventDefault() : (e.returnValue = false)
      // 鼠标按下，计算当前元素距离可视区的距离
      const disX = e.clientX - dialogHeaderEl.offsetLeft
      const disY = e.clientY - dialogHeaderEl.offsetTop
      const dragDomWidth = dragDom.offsetWidth // 对话框宽度
      const dragDomheight = dragDom.offsetHeight // 对话框高度
      const screenWidth = document.body.clientWidth // body当前宽度
      const screenHeight = document.documentElement.clientHeight
      const minDragDomLeft = dragDom.offsetLeft
      const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth
      const minDragDomTop = dragDom.offsetTop
      // const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight;
      // 获取到的值带px 正则匹配替换
      let styL, styT
      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (sty.left.includes('%')) {
        styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, '') / 100)
      } else {
        styL = +sty.left.replace(/\px/g, '')
        styT = +sty.top.replace(/\px/g, '')
      }
      document.onmousemove = function (e) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false)
        // 通过事件委托，计算移动的距离
        let left = e.clientX - disX
        let top = e.clientY - disY
        //边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }
        if (-top > minDragDomTop) {
          top = -minDragDomTop
        }
        // 移动当前元素
        dragDom.style.left = `${left + styL}px`
        dragDom.style.top = `${top + styT}px`
        //将此时的位置传出去
        // binding.value({x:e.pageX,y:e.pageY})
      }
      document.onmouseup = function (e) {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
})

// v-dialogDragWidth: 弹窗宽度拖大 拖小
Vue.directive('dialogDragWidth', {
  bind(el, binding, vnode, oldVnode) {
    const dragDom = el.querySelector('.el-dialog')
    const lineEl = document.createElement('div')
    lineEl.className = 'dialog-resizer'
    lineEl.style =
      'width: 4px; background: inherit; height: 80%; position: absolute; right: 0; top: 30px; bottom: 0; margin: auto; z-index: 1; cursor: w-resize;opacity: 0'
    lineEl.addEventListener(
      'mousedown',
      function (e) {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - el.offsetLeft

        // 当前宽度
        const curWidth = dragDom.offsetWidth

        document.onmousemove = function (e) {
          e.preventDefault() // 移动时禁用默认事件
          // 通过事件委托，计算移动的距离
          const l = e.clientX - disX
          dragDom.style.width = `${curWidth + l}px`
        }
        document.onmouseup = function (e) {
          document.onmousemove = null
          document.onmouseup = null
        }
      },
      false
    )
    dragDom.appendChild(lineEl)
  },
})
