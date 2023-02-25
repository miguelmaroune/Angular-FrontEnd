import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartServiceService } from 'src/app/services/cart-service.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Luv2ShopFormService } from 'src/app/services/luv2-shop-form.service';
import { Luv2ShopValidators } from 'src/app/validators/luv2-shop-validators';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup : FormGroup;

  totalPrice : number = 0;
  totalQuantity : number = 0;
  creditCardYears :number [] = [];
  creditCardMonth : number [] = [];

  countries : Country[] = [];

  shippingAddressStates : State[]  = [];
  billingAddressStates : State[]  = [];

//initialize Stripe Api
stripe = Stripe(environment.StripePublishableKey);

paymentInfo : PaymentInfo = new PaymentInfo();
cardElement : any ;
displayError : any = "";


  constructor(private formBuilder : FormBuilder,
              private luv2ShopFormService : Luv2ShopFormService,
              private cartService : CartServiceService,
              private checkoutService : CheckoutService,
              private router : Router)
               { }

  ngOnInit(): void {

    //setup Stripe payment form 
    this.setupStripePaymentForm();

    
    this.reviewCartDetails();
    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName : new FormControl('',
                            [Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        lastName  : new FormControl('',
                            [Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        email     : new FormControl('',
                            [Validators.required,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress : this.formBuilder.group({
        street: new FormControl('',
        [Validators.required,Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
        [Validators.required,Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
        [Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      billingAddress : this.formBuilder.group({
        street: new FormControl('',
        [Validators.required,Luv2ShopValidators.notOnlyWhiteSpace]),
        city: new FormControl('',
        [Validators.required,Luv2ShopValidators.notOnlyWhiteSpace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',
        [Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace])
      }),
      creditCard : this.formBuilder.group({
/*
        cardType: new FormControl('',[Validators.required]),
        nameOnCard: new FormControl('',
        [Validators.required,Validators.minLength(2),Luv2ShopValidators.notOnlyWhiteSpace]),
        cardNumber: new FormControl('',[Validators.required,Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('',[Validators.required,Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      */
      })

    });

    //populate credit card months 
    // const startMonth : number = new Date().getMonth() +1 ;
    // console.log("startMonth : "+startMonth);
    // this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
    //   data => {
    //     console.log("Retrieved credit card month : "+JSON.stringify(data));
    //     this.creditCardMonth = data
    //   }

    // );

    //poppulate credit card years
    // this.luv2ShopFormService.getCreditCardYears().subscribe(

    //   data => 
    //   {
    //     console.log("Retrieved credit card years : "+JSON.stringify(data));
    //     this.creditCardYears = data;
    //   }
    // );
      
 //populate countries
      this.luv2ShopFormService.getCountries().subscribe(
        data => 
        {
          console.log("Retrieved countries :"+JSON.stringify(data));
          this.countries = data;
        }
      );


  }
  setupStripePaymentForm() {

    //get a handle to Stripe elements

    var elements = this.stripe.elements();

    //Create a card element.. and hide the zip-code field

    this.cardElement = elements.create('card',{hidePostalCode : true});
    //Add an instance of card UI component into the 'card-element' div
    this.cardElement.mount('#card-element');
    //Add event binding for the 'change' event on the card element
    this.cardElement.on('change',(event:any) => 
    {
      //get a handle to card-errors element
      this.displayError = document.getElementById('card-errors');
      if(event.complete)
      {
        this.displayError.textContent = "";
      }
      else if (event.error)
      {
        //show validation error to customer 
        this.displayError.textContent = event.error.message;
      }
    } );
    
  }
  reviewCartDetails() {
    //subscribe to cartService
   this.cartService.totalQuantity.subscribe(
     totalQuantity => this.totalQuantity = totalQuantity
   );

   this.cartService.totalPrice.subscribe(
     totalPrice => this.totalPrice = totalPrice
   );
  }

onSubmit()
{
  console.log("Handling the submit button");
  if(this.checkoutFormGroup.invalid)
  {//touching all fields triggers the display of the error messages
    this.checkoutFormGroup.markAllAsTouched();
    return;
  }

  console.log(this.checkoutFormGroup.get('customer').value);

  console.log("Email Address : "+this.checkoutFormGroup.get('customer').value.email);

  console.log("Street : "+this.checkoutFormGroup.get('shippingAddress').value.street);

  console.log("shipping Country  : "+this.checkoutFormGroup.get('shippingAddress').value.country.name);
  //set up order 
let order = new Order();
order.totalPrice = this.totalPrice;
order.totalQuantity = this.totalQuantity;
  //get cart items
const cartItems = this.cartService.cartItem;
  //create orderItem from cartItem

  let orderItem : OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
  //set up purchase 
  let purchase = new Purchase();
  //populate purchase - customer 
  purchase.customer = this.checkoutFormGroup.controls['customer'].value;
  console.log(`customer : ${purchase.customer.firstName}`);
  //populate purchase - shipping address
  purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
  const shippingState : State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
  const shippingCountry : Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
  purchase.shippingAddress.state = shippingState.name;
  purchase.shippingAddress.country = shippingCountry.name; 

  //populate purchase - billing address
  purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
  const billingState : State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
  const billingCountry : Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
  purchase.billingAddress.state = billingState.name;
  purchase.billingAddress.country = billingCountry.name;
  //populate purchase - order and orderItems  
  purchase.order = order;
  purchase.orderItems = orderItem;
//compute payment info 

this.paymentInfo.amount = this.totalPrice * 100;
this.paymentInfo.currency = "USD";

//if valid form then 
//-create payment intent
//-confirm card payment
//-place order
// if (!this.checkoutFormGroup.invalid && this.displayError.textContent === "") {

//   this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
//     (paymentIntentResponse) => {
//       this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
//         {
//           payment_method: {
//             card: this.cardElement
//           }
//         }, { handleActions: false })
//       .then((result:any) => {
//         if (result.error) {
//           // inform the customer there was an error
//           alert(`There was an error: ${result.error.message}`);
//         } else {
//           // call REST API via the CheckoutService
//           this.checkoutService.placeOrder(purchase).subscribe({
//             next: (response: { orderTrackingNumber: any; }) => {
//               alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

//               // reset cart
//               this.resetCart();
//             },
//             error: err => {
//               alert(`There was an error: ${err.message}`);
//             }
//           })
//         }            
//       }.bind(this));
//     }
//   );
// } else {
//   this.checkoutFormGroup.markAllAsTouched();
//   return;
// }

  //call Rest Api via the checkoutService
  this.checkoutService.placeOrder(purchase).subscribe(
    {//next is for success
      next: response => {
        alert(`Your Order has been received \n order tracking number : ${response.orderTrackingNumber}`);
  //    //reset the cart
        this.resetCart();
      },
      //error is for exception
      error:err => {
        alert(`There was an error :  ${err.message}`);
      }
    }
  );

}
  resetCart() {

    //reset cart data 
this.cartService.cartItem = [];
this.cartService.totalPrice.next(0);
this.cartService.totalQuantity.next(0);
    //reset the form 
this.checkoutFormGroup.reset();
    // navigate back to the product page
    this.router.navigateByUrl("/products");
  }
//Customer 
get firstName(){ return this.checkoutFormGroup.get('customer.firstName');}
get lastName(){ return this.checkoutFormGroup.get('customer.lastName');}
get email(){ return this.checkoutFormGroup.get('customer.email');}
//shippingAddress
get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street');}
get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city');}
get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state');}
get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country');}
get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode');}
//billingAddress
get billingAddressStreet(){ return this.checkoutFormGroup.get('billingAddress.street');}
get billingAddressCity(){ return this.checkoutFormGroup.get('billingAddress.city');}
get billingAddressState(){ return this.checkoutFormGroup.get('billingAddress.state');}
get billingAddressCountry(){ return this.checkoutFormGroup.get('billingAddress.country');}
get billingAddressZipCode(){ return this.checkoutFormGroup.get('billingAddress.zipCode');}
//creditCard
get creditCardType(){ return this.checkoutFormGroup.get('creditCard.cardType');}
get creditCardNameOnCard(){ return this.checkoutFormGroup.get('creditCard.nameOnCard');}
get creditCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber');}
get creditCarSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode');}


copyShippingAddressToBillingAddress(event:any)
{


  if (event.target.checked) {
    console.log(this.checkoutFormGroup.get('billingAddress').value);
    this.checkoutFormGroup.get('billingAddress')
          .setValue(this.checkoutFormGroup.get('shippingAddress')?.value);
  
          //bug fix for state
          this.billingAddressStates = this.shippingAddressStates;
  
        }
  else {
    this.checkoutFormGroup.get('billingAddress').reset();

    //bug fix for states
    this.billingAddressStates = [];
  }
  

}

handleMonthAndYears()
{
  const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

  const currentYear : number = new Date().getFullYear();

  const selectedYear : number = Number(creditCardFormGroup.value.expirationYear);

//if the current year equals the selected year then start with the current month 
let startMonth : number;
if(currentYear === selectedYear)
{
  startMonth = new Date().getMonth() + 1;
}
else
{
  startMonth = 1 ;
}

this.luv2ShopFormService.getCreditCardMonth(startMonth).subscribe(
  data => 
  {
    console.log("Retrieved credit cardd month : "+JSON.stringify(data));
    this.creditCardMonth = data
    
  }
);
}


getStates(formGroupName : string)
{
  const formGroup = this.checkoutFormGroup.get(formGroupName);

  const countryCode = formGroup.value.country.code;
  const countryName = formGroup.value.country.name;

  console.log(`${formGroupName} country Code ${countryCode}`);
  console.log(`${formGroupName} country name ${countryName}`);

  this.luv2ShopFormService.getStates(countryCode).subscribe(
    data => 
    {
      if(formGroupName === 'shippingAddress')
      {
        this.shippingAddressStates =  data;
         
      }
      else
      {
        this.billingAddressStates = data;
      }
      //select first item by default
      formGroup.get('state').setValue(data[0]);
    }
  );
}

}
