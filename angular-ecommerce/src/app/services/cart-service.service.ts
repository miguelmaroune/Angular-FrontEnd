import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartServiceService {
  
  cartItem : CartItem[] = [];

  //subject is a sub class of Observable , we can use it to publish events in our code 
  // the event will be sent to all of the subscribers.
  //ReplaySubject will give all the subjects value over time ...(eza component ken ba3d manno makhlou2 bas ya3mel subscribe mneb3atlo kell chi sayer)
  totalPrice : Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity :Subject<number> = new BehaviorSubject<number>(0);

  constructor() { }


addToCart(theCartItem : CartItem)
{
//check if we already have the item in our cart 
let alreadyExistsInCart : boolean = false ;
let existingCartItem : CartItem = undefined;

if(this.cartItem.length > 0)
{
  //find the item in the cart based on item id 
// for (let tempCartItem of this.cartItem)
// {
//   if(tempCartItem.id == theCartItem.id)
//   {
//     existingCartItem = tempCartItem;
//     break;
//   }

// }
existingCartItem = this.cartItem.find(tempCartItem => tempCartItem.id === theCartItem.id);
//check if we found it 
alreadyExistsInCart = (existingCartItem != undefined);
}

if(alreadyExistsInCart )
{
  //increment the quantity 
  existingCartItem.quantity ++;
}
else
{
  this.cartItem.push(theCartItem);
}
//compute cart total price and total quantity
this.computeCartTotals();

}
  computeCartTotals() {
    let totalPriceValue:number = 0;
    let totalQuantityValue :number = 0;

    for(let currentCartItem of this.cartItem)
    {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }
// publish the new values .. all subscribers will receive the new data (cart status ...)
this.totalPrice.next(totalPriceValue);
this.totalQuantity.next(totalQuantityValue);  
  //log cart data 
  this.logCartData(totalPriceValue,totalQuantityValue);
  
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) 
  {
  console.log( `content of the cart `);
  for(let tempCartItem of this.cartItem)
  {
    const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
    console.log(`name: ${tempCartItem.name} quantity=${tempCartItem.quantity}, unitPrice =${tempCartItem.unitPrice}, subTotalPrice = ${subTotalPrice} `);
  } 
  console.log(`totalPrice : ${totalPriceValue.toFixed(2)} , totalQuantity:${totalQuantityValue}`);
  console.log(`----`);  
}

decrementQuantity(theCartItem: CartItem) {
  theCartItem.quantity --;
  if(theCartItem.quantity ==0)
  {
    this.remove(theCartItem);
  }
  else
  {
    this.computeCartTotals();
  }

}
  remove(theCartItem: CartItem) {
  //get index of the item from the array
    const itemIndex = this.cartItem.findIndex(tempCartItem => tempCartItem.id === theCartItem.id);

  //if found ,remove the item from the array at the given index.
  if(itemIndex > -1 )
  {
    //splice will remove items from the list (,1 to remove only the first item from the given index)
    this.cartItem.splice(itemIndex,1);
  }
  }


}
