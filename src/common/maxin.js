import {debounce} from 'common/utils'
import BackTop from "components/common/backTop/BackTop";

export const itemListenerMixin = {
  data() {
    return {
      itemImageListener: null
    }
  },
  mounted() {
    const refresh = debounce(this.$refs.scroll.refresh, 50);

    this.itemImageListener = () => {
      refresh();
    }

    this.$bus.$on("itemImageLoad", this.itemImageListener)
  }
}

export const backTopMixin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false
    }
  },
  methods: {
    backClick() {
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    contentScroll(position) {
      // 判断BackTop是否显示
      this.isShowBackTop = -position.y > 1000
      // 决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
  }
}
