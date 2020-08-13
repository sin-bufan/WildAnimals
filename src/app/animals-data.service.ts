import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, Subject } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class AnimalsDataService {

  constructor(public http: HttpClient) {
  }

  CN_DATA_URL: string = "assets/data/cn/animals.json";
  EN_DATA_URL: string = "assets/data/en/animals.json";
  public static CN: string = "cn";
  public static EN: string = "en"
  //当前语言
  private _language: string = AnimalsDataService.CN;
  public set language(v: string) {
    this._language = v;
  }
  public get language(): string {
    return this._language;
  }

  $currentAnimal = new Subject<string>();
  $currentLanguage = new Subject<string>();
  $currentAnimalSection = new Subject<string>();
  //获取动物列表数据
  getAnimals(): any {
    switch (this.language) {
      case AnimalsDataService.CN:
        return this.http.get(this.CN_DATA_URL, { responseType: 'json' });
        break;
      case AnimalsDataService.EN:
        return this.http.get(this.EN_DATA_URL, { responseType: 'json' });
        break;
    }
  }
  //获取动物数据
  getAnimal(url: string): any {
    return this.http.get(url, { responseType: 'json' });
  }
  //获取地理信息数据
  getGEOJSON(url: string): any {
    return this.http.get(url, { responseType: 'json' });
  }

}


export class AnimalIndexData{
  name:string;
  name2:string;
  imageURL:string;
  dataURL:string;
}