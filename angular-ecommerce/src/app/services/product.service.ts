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

  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  // Map the Json data from spring data rest to product array.
  getProductList(theCategoryId : number) : Observable<Product[]> 
  {
    // need to build URL based on category id .
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

   return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage:number ,
                         thePageSize: number , 
                         theCategoryId : number) : Observable<GetResponseProducts> 
  {
    // need to build URL based on category id,page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
    +`&page=${thePage}&size=${thePageSize}`;

   return this.httpClient.get<GetResponseProducts>(searchUrl);
  }




getProductCategories() : Observable<ProductCategory[]>{

  return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
    map(response => response._embedded.productCategory)
  );
}

searchProducts(theKeyWord: string) : Observable<Product[]> 
{
  // need to build URL based on category id .
  const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`;

  return this.getProducts(searchUrl);
}

searchProductListPaginate(thePage:number ,
                          thePageSize: number , 
                          theKeyWord : string) : Observable<GetResponseProducts> 
{
const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyWord}`
                 +`&page=${thePage}&size=${thePageSize}`;

return this.httpClient.get<GetResponseProducts>(searchUrl);
}

getProduct(theProductId: number): Observable<Product> 
{
// no need to to unwrap the json because its only one value.
const searchUrl = `${this.baseUrl}/${theProductId}`;

return  this.httpClient.get<Product>(searchUrl);
}

}



//_embedded all Feature resources get embedded into the response so you don't have to load them separately.
// unwrap the Json from Spring data rest 
interface GetResponseProducts 
{//this will unwrap the json object
 _embedded: 
 {
   products : Product[];
 },
 page: 
 {// added to capture the meta data returned by spring data rest on the pages.
   size: number , 
   totalElements: number , 
   totalPages: number ,
   number: number
 }  
}


interface GetResponseProductCategory
{
 _embedded: 
 {
   productCategory  : ProductCategory[];
 }  
}