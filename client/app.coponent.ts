import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  template: `
    <!doctype html>
    <html>
    <head>
    <meta charset="utf-8">
    <title>Retail Pricing Management</title>
    <base href="/">

    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500,700" rel="stylesheet">
    </head>
    <body>
        <h2>Retail Pricing Management</h2>

        <input type="file" (change)="upload($event)">

        <input [(ngModel)]="sku" placeholder="Search SKU">
        <button (click)="search()">Search</button>

        <table>
        <tr *ngFor="let p of prices">
            <td>{{p.storeId}}</td>
            <td>{{p.sku}}</td>
            <td>{{p.productName}}</td>
            <td><input [(ngModel)]="p.price"></td>
            <td><button (click)="update(p)">Save</button></td>
        </tr>
        </table>
    </body>
    </html>
    
  `
})
export class AppComponent {
  prices: any[] = [];
  sku = '';

  constructor(private http: HttpClient) {}

  upload(event: any) {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    this.http.post('http://localhost:3000/upload', formData).subscribe();
  }

  search() {
    this.http.get<any[]>(`http://localhost:3000/prices?sku=${this.sku}`)
      .subscribe(res => this.prices = res);
  }

  update(p: any) {
    this.http.put(`http://localhost:3000/prices/${p._id}`, p).subscribe();
  }
}
