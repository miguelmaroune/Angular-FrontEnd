import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient : HttpClient) { }//inject the http client .

  // Map the Json data from spring data rest to product array.
  getProductList() : Observable<Product[]> 
  {
   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
     map(response => response._embedded.products)
   );
  }
}
//_embedded all Feature resources get embedded into the response so you don't have to load them separately.
// unwrap the Json from Spring data rest 
interface GetResponse 
{
 _embedded: 
 {
   products : Product[];
 }  
}