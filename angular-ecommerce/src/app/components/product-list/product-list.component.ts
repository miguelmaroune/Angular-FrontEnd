import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-table.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products !: Product[];
  constructor(private productService : ProductService) { }

  // Called on init of the componenet 
  ngOnInit(): void {
    this.listProducts();
  }

// we use the product Service to get the data 
// subscribe will fetch the data in an async way and data will be assigned to this.products once retrieved.
  listProducts() {
    this.productService.getProductList().subscribe(
      data => 
      {
        this.products = data;
      }
    );
  }

}
