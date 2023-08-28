import { Component } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketItem } from '../../shared/models/basket';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent {

  constructor(public basketService: BasketService, public accountService:AccountService){}
  // getCount(items: BasketItem[]){
  //   return items.reduce((sum, item) => sum + item.quantity, 0);
  // }
  getCount(items: BasketItem[]) {
    if (!Array.isArray(items)) {
      return 0; // Return 0 if items is not an array
    }
    return items.reduce((sum, item) => sum + item.quantity, 0);


}
}
