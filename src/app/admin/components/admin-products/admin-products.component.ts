import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from 'src/app/shared/services/product.service';
import { Observable, Subscription } from 'rxjs';
import { DataTableResource } from 'angular5-data-table';
import { Product } from '../../../shared/models/product';



@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  products: any[];
  subscription: Subscription;
  tableResource: DataTableResource<any>;
  items: any[] = [];
  itemCount: number;
  

  constructor(private productService: ProductService) {
    this.subscription = this.productService.getAll()
      .subscribe(products => {
        this.products = products;
        this.initializeTable(products);
      });
   }

  private initializeTable(products: any[]) {

    this.tableResource = new DataTableResource(products);
    this.tableResource.query({ offset: 0 })
      .then(items => this.items = items);
    this.tableResource.count()
      .then(count => this.itemCount = count);
   }

   filter(query: string) {
     let filteredProducts = (query) ?
      this.products.filter(p => p.title.toLowerCase().includes(query.toLowerCase())) :
        this.products;
      
      this.initializeTable(filteredProducts);
   }

   reloadItems(params) {
     if (!this.tableResource) return;
    this.tableResource.query(params)
    .then(items => this.items = items);
   }
  

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
  }
 
}
