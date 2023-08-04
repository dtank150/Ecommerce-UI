import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pagination } from '../shared/models/pagination';
import { Product } from '../shared/models/products';
import { Brand } from '../shared/models/brands';
import { Type } from '../shared/models/type';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  basUrl = 'https://localhost:44389/api/';

  constructor(private http:HttpClient) { }

  getProducts(shopParamas: ShopParams){
    let params = new HttpParams();
    if(shopParamas.brandId > 0) params = params.append('brandId', shopParamas.brandId);
    if(shopParamas.typeId) params = params.append('typeId', shopParamas.typeId);
    params =params.append('sort', shopParamas.sort);
    params =params.append('pageIndex', shopParamas.pageNumber);
    params =params.append('pageSize', shopParamas.pageSize);
    if(shopParamas.search) params = params.append('search',shopParamas.search);
    return this.http.get<Pagination<Product[]>>(this.basUrl + 'Products', {params});
  }
  getBrands(){
    return this.http.get<Brand[]>(this.basUrl + 'Products/brands');
  }
  getTypes(){
    return this.http.get<Type[]>(this.basUrl + 'Products/types');
  }
  
}
