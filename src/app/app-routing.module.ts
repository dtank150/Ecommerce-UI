import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {path: '',component: HomeComponent, data:{breadcrumb: 'Home'}},
  {path:'Shop',loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule)},
  {path:'Basket',loadChildren: () => import('./basket/basket.module').then(m => m.BasketModule)},
  {path:'Checkout',canActivate: [AuthGuard],loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule)},
  {path:'Account',loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {path:'**', redirectTo:'', pathMatch:'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

