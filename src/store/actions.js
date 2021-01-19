import {
  ADD_COUNTER,
  ADD_TO_CART
} from './mutation-types'

export default {
  addCart(context, payload) {

    /*for (let item of state.cartList){
      if (item.id === payload.id){
        oldProduct = item;
      }
    }*/
    let product = context.state.cartList.find(item => item.id === payload.id)

    if (product){
      // product.count += 1;
      context.commit(ADD_COUNTER,product)
    } else {
      payload.count = 1;
      context.commit(ADD_TO_CART, payload);
    }
  }
}
