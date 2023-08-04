import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Basket, BasketItem, BasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { Product } from '../shared/models/products';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  basUrl = 'https://localhost:44389/api/';
  private basketSouce = new BehaviorSubject<Basket | null>(null);
  basketSouce$ = this.basketSouce.asObservable();
  private basketTotalSource = new BehaviorSubject<BasketTotals | null>(null);
  basketTotalSource$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string){
    return this.http.get<Basket>(this.basUrl + 'basket?id=' +id).subscribe({
      next: basket => {
        this.basketSouce.next(basket);
        this.calculateTotals();
      }
    })
  }

  setBasket(basket: Basket){
    return this.http.post<Basket>(this.basUrl + 'basket',basket).subscribe({
      next: basket => {
        this.basketSouce.next(basket);
        this.calculateTotals();
      }
    })
  }

  getCurrentBasketValue(){
    return this.basketSouce.value;
  }

  addItemToBasket(item: Product | BasketItem, quantity = 1){
    if(this.isProduct(item)) item = this.mapProductItemToBasketItem(item);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, item, quantity);
    this.setBasket(basket);
  }

  removeItemFormBasket(id:number, quantity = 1){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
    const item = basket.items.find(x => x.id === id);
    if(item){
      item.quantity -= quantity;
      if(item.quantity === 0){
        basket.items = basket.items.filter(x => x.id !== id);
      }
      if(basket.items.length > 0) this.setBasket(basket);
      else this.deleteBasket(basket);
    }
  }
  deleteBasket(basket: Basket) {
    return this.http.delete(this.basUrl + 'basket?id=' + basket.id).subscribe({
      next: () => {
        this.basketSouce.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      }
    })
  }


  // private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
  //  const item = items.find(x => x.id === itemToAdd.id);
  //  if(item) item.quantity += quantity;
  //  else{
  //   itemToAdd.quantity = quantity;
  //   items.push(itemToAdd);
  //  }
  //  return items;
  // }

  private addOrUpdateItem(items: BasketItem[], itemToAdd: BasketItem, quantity: number): BasketItem[] {
    if (!Array.isArray(items)) {
      return items; // Return the items as-is if it's not an array
    }
    const item = items.find(x => x.id === itemToAdd.id);
  if (item) {
    item.quantity += quantity;
  } else {
    itemToAdd.quantity = quantity;
    items.push(itemToAdd);
  }

  return items;
}
  private createBasket(): Basket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }


  private mapProductItemToBasketItem(item: Product): BasketItem{
    return{
      id: item.id,
      productName: item.name,
      price: item.price,
      quantity: 0,
      pictureUrl: item.pictureUrl,
      brand: item.productBrand,
      type: item.productType
    }
  }
  private calculateTotals(){
    const basket = this.getCurrentBasketValue();
    if(!basket) return;
    const shipping = 0;
    const subtotal = basket.items.reduce((a, b)=>(b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }
  private isProduct(item:Product | BasketItem): item is Product {
    return (item as Product).productBrand !== undefined;
  }
}
