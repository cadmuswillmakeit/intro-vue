import { defineStore } from 'pinia'

export const useBasketStore = defineStore('basket', {
  state: () => ({
    basket: []
  }),
  getters: {
    getNumberProduct() {
      return this.basket.length
    },
    getTotalPrice() {
      let total = 0
      for (let product of this.basket) {
        total += product.quantity * product.price
      }
      return total
    }
  },
  actions: {
    getBasket() {
      let panier = localStorage.getItem('basket')
      if (panier == null) {
        this.basket = []
      } else {
        this.basket = JSON.parse(panier)
      }
    },
    addBasket(product) {
      let foundProduct = this.basket.find((p) => p.id == product.id)
      if (foundProduct !== undefined) {
        foundProduct.quantity++
      } else {
        product.quantity = 1
        this.basket.push(product)
      }
      localStorage.setItem('basket', JSON.stringify(this.basket))
    },
    changeQuantity(product, quantity) {
      let foundProduct = this.basket.find((p) => p.id == product.id)
      if (foundProduct !== undefined) {
        foundProduct.quantity += quantity
        if (foundProduct.quantity <= 0) {
          this.basket = this.basket.filter((p) => p.id !== product.id)
        } else {
          localStorage.setItem('basket', JSON.stringify(this.basket))
        }
      }
    },
    removeFromBasket(product) {
      this.basket = this.basket.filter((p) => p.id != product.id)
      localStorage.setItem('basket', JSON.stringify(this.basket))
    }
  }
})
