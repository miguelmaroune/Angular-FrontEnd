import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  private categoryUrl ='http://localhost:8080/api/product-category';
  constructor(private httpClient : HttpClient) { }//inject the http client .

  // Map the Json data from spring data rest to product array.
  getProductList(theCategoryId : number) : Observable<Product[]> 
  {
    // need to build URL based on category id .
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

   return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
     map(response => response._embedded.products)
   );
  }

  
getProductCategories() : Observable<ProductCategory[]>{

  return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
    map(response => response._embedded.productCategory)
  );
}


}



//_embedded all Feature resources get embedded into the response so you don't have to load them separately.
// unwrap the Json from Spring data rest 
interface GetResponseProducts 
{
 _embedded: 
 {
   products : Product[];
 }  
}


interface GetResponseProductCategory
{
 _embedded: 
 {
   productCategory  : ProductCategory[];
 }  
}