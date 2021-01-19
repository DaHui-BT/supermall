<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                 ref="tabControl1"
                 class="tab-control"
                 v-show="isTabFixed"/>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"/>
      <recommend-view :recommends="recommends"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl2"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>

</template>

<script>
  import HomeSwiper from 'views/home/childComps/HomeSwiper'
  import RecommendView from "views/home/childComps/RecommendView";
  import FeatureView from "views/home/childComps/FeatureView";

  import NavBar from 'components/common/navbar/NavBar'
  import TabControl from "components/content/tabControl/TabControl";
  import GoodsList from "components/content/goods/GoodsList";
  import Scroll from 'components/common/scroll/Scroll'
  import BackTop from "components/common/backTop/BackTop";

  import {itemListenerMixin, backTopMixin} from "common/maxin";

  import {
    getHomeMultidata,
    getHomeGoods
  } from "network/home";
  import {debounce} from 'common/utils'

  export default {
    name: "Home",
    components: {
      HomeSwiper,
      RecommendView,
      FeatureView,
      NavBar,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0, list: []},
          'new': {page: 0, list: []},
          'sell': {page: 0, list: []},
        },
        currentType: 'pop',
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list;
      }
    },
    created() {
      // 请求多个数据
      this.getHomeMultidata()
      // 请求商品数据
      this.getHomeGoods('pop');
      this.getHomeGoods('new');
      this.getHomeGoods('sell');

    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0)
      this.$refs.scroll.refresh()
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();
      // 取消全局事件的监听
      this.$bus.$off("itemImageLoad", this.itemListener)
    },

    methods: {
      /**
       * 事件监听相关方法
       **/
      /*debounce(fun, delay) {
        let timer = null;
        return function(...args) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => {
            fun.apply(this, args);
          }, delay)
        }
      },*/
      tabClick(index) {
        switch(index) {
          case 0:
            this.currentType = 'pop';
            break;
          case 1:
            this.currentType = 'new';
            break;
          case 2:
            this.currentType = 'sell';
            break;
        }
        this.$refs.tabControl1.currentIndex = index;
        this.$refs.tabControl2.currentIndex = index;
      },
      contentScroll(position) {
        // 判断BackTop是否显示
        this.isShowBackTop = -position.y > 1000
        // 决定tabControl是否吸顶（position：fixed）
        this.isTabFixed = (-position.y) > this.tabOffsetTop
      },
      loadMore() {
        this.getHomeGoods(this.currentType);
        // this.$refs.scroll.scroll.refresh();
      },
      swiperImageLoad() {
        // 获取tabControl的offsetTop
        this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
      },

      /**
       * 网络请求相关方法
       */
      getHomeMultidata() {
        // 请求多个数据
        getHomeMultidata().then(res => {
          // console.log(res);
          this.banners = res.data.banner.list;
          this.recommends = res.data.recommend.list;
        })
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // console.log(res);
          this.goods[type].list.push(...res.data.list);
          this.goods[type].page += 1;

          this.$refs.scroll.finishPullUp()
        })
      },
    }
  }
</script>

<style scoped>

  #home {
    /*padding-top: 44px;*/
    /*vh：视口高度*/
    height: 100vh;
    position: relative;
    /*z-index: 8;*/
  }

  /*.home-nav {*/
  /*  background-color: var(--color-tint);*/
  /*  color: #fff;*/
  /*}*/
  .home-nav {
    color: #fff;
    position: fixed;
    background-color: var(--color-tint);
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
  }

  .content {
    height: 300px;
    /*overflow: hidden;*/

    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  /*.content {*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*}*/

  .tab-control {
    position: relative;
    z-index: 9;
    height: 44px;
  }

</style>
