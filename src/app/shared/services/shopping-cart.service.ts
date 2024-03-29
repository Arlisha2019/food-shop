import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject} from '@angular/fire/database';
import { create } from 'domain';
import { Product } from '../models/product';
import { take, map } from 'rxjs/operators';
import { ShoppingCart } from '../models/shopping-cart';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }
  
  async getCart(): Promise<Observable<ShoppingCart>> {
    let cartId =  await this.getOrCreateCartId();
    let cart = this.db.object('/shopping-carts/' + cartId).snapshotChanges()
      .pipe(map((x : any) => {
        const key = x.key;
        const items = x.payload.val().items;

        return new ShoppingCart(items);
      })
    );
      return cart;
  }

  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }

  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }

  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('/shopping-carts/' + cartId + '/items').remove();
  }


  private create() {
      return this.db.list('/shopping-carts').push({
        dateCreated: new Date().getTime()
      })
  }

  private async getOrCreateCartId() : Promise<string> {
    let cartId = localStorage.getItem('cartId');
    if(cartId) return cartId;
    
      let result = await this.create();
      localStorage.setItem('cartId', result.key);
      return result.key;
      }  

  private getItem(cartId: string, productId: string) {
    return this.db.object('/shopping-carts/' + cartId + '/items/' + productId);
  }

  private async updateItem(product: Product, change: number) {
      let cartId = await this.getOrCreateCartId();

      let item$ = this.getItem(cartId, product.key)
    
      item$.snapshotChanges().pipe(take(1)).subscribe(item => {

        let quantity = (item.payload.exists() ? item.payload.val()['quantity'] : 0) + change;

        if ( quantity === 0 ) item$.remove();
        else item$.update({ 
            title: product.title,
            imageUrl: product.imageUrl,
            price: product.price,
            quantity: quantity
      });  
    }) 
  }
}