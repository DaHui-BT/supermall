<template>
<!-- ref/children
      ref如果是绑定在组件上的，那么通过this.$refs.refname获取到的是一个组件对象
      ref如果是绑定在普通元素上的，那么通过this.$refs.refname获取到的是一个元素对象
 -->
  <div class="wrapper" ref="wrapper">
    <div class="content" ref="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'

  export default {
    name: "Scroll",
    props: {
      probeType: {
        type: Number,
        default: 0
      },
      pullUpLoad: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        scroll: null,
      }
    },
    mounted() {
      // 创建BScroll
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true,
        probeType: this.probeType,
        pullUpLoad: this.pullUpLoad,
      })

      // 监听滚动位置
      if (this.probeType === 2 || this.probeType === 3){
        this.scroll.on('scroll', (position) => {
          this.$emit('scroll', position)
        })
      }
      // 监听上拉事件
      if (this.pullUpLoad){
        this.scroll.on('pullingUp', () => {
          this.$emit('pullingUp')
        })
      }
    },
    methods: {
      scrollTo(x, y, time = 300) {
        this.scroll && this.scroll.scrollTo(x, y, time);
      },
      finishPullUp() {
        this.scroll && this.scroll.finishPullUp();
      },
      refresh() {
        this.scroll && this.scroll.refresh();
      },
      getScrollY() {
        return this.scroll ? this.scroll.y : 0;
      }
    }
  }
</script>

<style scoped>

</style>
