import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { ActionSequence } from 'protractor';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
 categories$;

  constructor(private db: AngularFireDatabase) { }

  getAll() {
    return this.db.list('/categories', ref => ref.orderByChild('name'))
      .snapshotChanges()
        .pipe(
          map(action => action.map(a => ({  key: a.key, ...a.payload.val() }))
      )
    );
  }
}
