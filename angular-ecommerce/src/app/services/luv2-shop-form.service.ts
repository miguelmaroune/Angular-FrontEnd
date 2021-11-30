import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {

  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl    = 'http://localhost:8080/api/states';
  
  constructor(private httpClient : HttpClient) { }

  getCountries():Observable<Country[]>
  {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }
getStates(theCountryCode : string) : Observable<State[]>
{
  //search url
  const searchStateUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;
  return this.httpClient.get<GetResponseStates>(searchStateUrl).pipe(
    map(response => response._embedded.states)
  );
}

  getCreditCardMonth(startMonth : number) : Observable<number[]>
  {
    let data : number[] = [];

    //build an array for Month drop down list
    // - start at current month and loop untill month #12

    for (let theMonth = startMonth ;theMonth <= 12 ; theMonth ++)
    {
      data.push(theMonth);
    }
//The "of" operator from rxjs, will wrap an object as an Observable 
//we need to return an Obs because the angular component will subscribe to this component to receive the async data.
    return of(data);
  }

getCreditCardYears() : Observable<number[]>
{
let data :number[] = [];
//build an array for Year dropdown list
// loop for the next 10 years
const startYear : number = new Date().getFullYear();
const endYear : number = startYear + 10;

for(let theYear = startYear ; theYear <= endYear ; theYear++)
{
  data.push(theYear);
}

return of(data);
}



}

interface GetResponseCountries
{
  _embedded :
  {
    countries: Country[ ];
  }
}

interface GetResponseStates 
{
  _embedded :
  {
    states: State[ ];
  }
}