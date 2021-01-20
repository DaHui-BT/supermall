<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
    <scroll class="content"
            ref="scroll"
            :probe-type="3"
            @scroll="contentScroll">
      <detail-swiper :topImages="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-image-info :detail-info="detailInfo"/>
      <detail-goods-info :detail-info="detailInfo" @imgLoad="imgLoad"/>
      <detail-param-info ref="params" :paramInfo="paramInfo"/>
      <detail-comment-info ref="comment" :commentInfo="commentInfo"/>
      <goods-list ref="recommend" :goods="recommendInfo" @imgLoad="imgLoad"/>
    </scroll>
    <back-top @click.native="backClick" v-show="isShowBackTop"/>
    <detail-bottom-bar @addCart="addToCart"/>
<!--    <toast :message="message" :show="show"/>-->
  </div>
</template>

<script>
  import DetailNavBar from "views/detail/childComponents/DetailNavBar";
  import DetailSwiper from 'views/detail/childComponents/DetailSwiper'
  import DetailBaseInfo from "views/detail/childComponents/DetailBaseInfo";
  import DetailShopInfo from "views/detail/childComponents/DetailShopInfo";
  import DetailGoodsInfo from "views/detail/childComponents/DetailGoodsInfo";
  import DetailParamInfo from "views/detail/childComponents/DetailParamInfo";
  import DetailImageInfo from 'views/detail/childComponents/DetailImageInfo'
  import DetailCommentInfo from "views/detail/childComponents/DetailCommentInfo";
  import DetailBottomBar from "views/detail/childComponents/DetailBottomBar";

  import Scroll from 'components/common/scroll/Scroll'
  import GoodsList from "components/content/goods/GoodsList";
  // import Toast from 'components/common/toast/Toast'

  import {getDetail, Goods, Shop, Param, getRecommend} from "network/detail";
  import {itemListenerMixin, backTopMixin} from "common/maxin";
  import {debounce} from "common/utils";
  import {mapActions} from 'vuex'

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      Scroll,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailImageInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      // Toast
    },
    mixins: [itemListenerMixin, backTopMixin],
    data() {
      return {
        id: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo: {},
        recommendInfo: [],
        themeTopYs: [0, 1000, 2000, 2500],
        getThemeTopY: null,
        currentIndex: 0,
        isShowBackTop: false,
        // message: '',
        // show: false
      }
    },
    created() {
      // 保存传入的id
      this.id = this.$route.params.id
      // 根据id请求数据
      getDetail(this.id).then(res => {
        console.log(res);
        // 获取顶部图片
        this.topImages = res.result.itemInfo.topImages;

        const data = res.result;
        // 获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo);

        // 创建店铺信息的对象
        this.shop = new Shop(data.shopInfo)

        // 保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 获取参数信息
        this.paramInfo = new Param(data.itemParams.info, data.itemParams.rule);

        // 取出评论信息
        if (data.rate.cRate !== 0) {
          this.commentInfo = data.rate.list[0]
        }
        // 等待前面的都渲染完才会执行此函数
        /*this.$nextTick(() => {
          this.themeTopYs = []

          this.themeTopYs.push(0)
          this.themeTopYs.push(this.$refs.params.$el.offsetTop)
          this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
          this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
          console.log(this.themeTopYs);
        })*/

      })

      getRecommend().then(res => {
        this.recommendInfo = res.data.list;
      })

      this.getThemeTopY = debounce(() => {
        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.params.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      })
    },
    methods: {
      ...mapActions(['addCart']),

      imgLoad() {
        this.$refs.scroll.refresh();
        this.getThemeTopY()
      },
      titleClick(index) {
        this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 300)
      },
      contentScroll(position) {
        // 获取y值
        const positionY = -position.y
        let length = this.themeTopYs.length
        for (let i = 0; i < length - 1; i ++){

          if (this.currentIndex !== i && (positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])){
            this.currentIndex = i;
            this.$refs.nav.currentIndex = this.currentIndex;
          }

          // 判断BackTop是否显示
          this.isShowBackTop = -position.y > 1000

          // if (this.currentIndex !== i && (i < length - 1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i + 1])
          //   || (i === length - 1 && positionY >= this.themeTopYs[i])){
          //   this.currentIndex = i;
          //   console.log(this.currentIndex);
          //   this.$refs.nav.currentIndex = this.currentIndex;
          // }
        }
      },
      addToCart() {

        // 获取购物车需要显示的信息
        const product = {}
        product.image = this.topImages[0];
        product.title = this.goods.title;
        product.desc = this.goods.desc;
        product.price = this.goods.price;
        product.id = this.id;

        this.addCart(product).then(res => {
          // this.show = true;
          // this.message = res;
          // setTimeout(() => {
          //   this.show = false;
          //   this.message = '';
          // }, 1500)

          this.$toast.show(res, 1500)
        })

        // 将商品添加到购物车
        /*this.$store.dispatch('addCart', product).then(res => {
          console.log(res);
        })*/
      }

    },
    destroyed() {
      this.$bus.$off("itemImageLoad", this.itemImageListener)
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 9;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background: #fff;
  }

  .content {
    height: calc(100% - 44px);
  }
</style>
