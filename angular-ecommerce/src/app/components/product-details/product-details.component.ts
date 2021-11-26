import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  //created an empty product to avoid the race error
  //in handleProductDetails the data is retrieved in an async manner so we might see error in the developer tool because the browser loaded the page 
  // before we retrieved the data from the spring back end. Angular will refresh the page once the data is retrieved(data binding)
  product : Product = new Product();

  constructor(private productService : ProductService ,
              private cartService : CartServiceService,
    private route : ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProductDetails();
    }
    );
  }
  handleProductDetails() {
    // get the "id" param and convert it to a number with the + sign
    const theProductId :number = +this.route.snapshot.paramMap.get('id');
    console.log(theProductId);
    this.productService.getProduct(theProductId).subscribe(
      data => {
        this.product = data;
        console.log(this.product.name);
      }
    )

  }

  addToCart()
  {
    console.log( `adding to cart :${this.product.name} , ${this.product.unitPrice}`);
    const theCartItem = new CartItem (this.product);
    
    this.cartService.addToCart(theCartItem);
  }
}
