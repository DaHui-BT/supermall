import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {

    return new Promise((resolve, reject) => {
      /*for (let item of state.cartList){
      if (item.id === payload.id){
        oldProduct = item;
      }
    }*/
      let product = context.state.cartList.find(item => item.id === payload.id)

      if (product){
        // product.count += 1;
        context.commit(ADD_COUNTER,product)
        resolve("商品添加加一")
      } else {
        payload.count = 1;
        context.commit(ADD_TO_CART, payload);
        resolve("商品添加成功")
      }
    })
  }
}
