import { QueryResolver } from '../QueryResolver';
import { SortableResolverPredicate } from './SortableResolverPredicate';

export abstract class SortableResolver<TPredicate extends SortableResolverPredicate<any, any, any>> {
  private _queryResolver: QueryResolver<any>;
  readonly predicates: TPredicate[] = [];

  abstract setup(): void;

  constructor() {
    this.setup();
  }

  get queryResolver(): QueryResolver<any> {
    return this._queryResolver;
  }

  setupQueryResolver(queryResolver: QueryResolver<any>) {
    this._queryResolver = queryResolver;
  }

  protected addPredicate(predicate: TPredicate): void {
    this.predicates.push(this.wrapPredicate(predicate));
  }

  protected wrapPredicate(predicate: TPredicate): TPredicate {
    return predicate;
  }
}
