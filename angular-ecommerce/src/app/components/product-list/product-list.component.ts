import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products !: Product[];
  currentCategoryId!: number;

  constructor(private productService : ProductService,
              private route: ActivatedRoute    ) { }

  // Called on init of the componenet 
  ngOnInit() {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
    
  }

// we use the product Service to get the data 
// subscribe will fetch the data in an async way and data will be assigned to this.products once retrieved.
  listProducts() {
    //check if "id" is available
    const hasCategoryId :boolean = this.route.snapshot.paramMap.has('id');
    if(hasCategoryId) 
    {
      //get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }
    else 
    {
      //no category available ... default to category 1 
      this.currentCategoryId =1;
    }
    //now get the products for the given category id.
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => 
      {
        this.products = data;
      }
    );
  }

}
