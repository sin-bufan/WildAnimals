import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
@Injectable({
  providedIn: 'root'
})
export class AnimalsDataService {

  constructor(public http: HttpClient) {
  }

  public static CN_DATA_URL: string = "assets/data/cn/animals.json";
  public static EN_DATA_URL: string = "assets/data/en/animals.json";
  getAnimals(url:string): any {
    return this.http.get(url, { responseType: 'json' });
  }
  getAnimal(url:string): any {
    return this.http.get(url, { responseType: 'json' });
  }
}
