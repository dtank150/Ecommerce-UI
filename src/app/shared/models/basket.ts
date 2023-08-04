export interface BasketItem {
    id: number
    productName: string
    price: number
    quantity: number
    pictureUrl: string
    type: string
    brand: string
  }

export interface Basket {
    id: string
    items: BasketItem[]
  }

 export class Basket implements Basket {
    id = '1';
    items: BasketItem[] = [];
 }

export interface BasketTotals {
  shipping:number;
  subtotal:number;
  total:number;
}
