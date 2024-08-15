// import { Entity, EntityKey, ValueObjectAtomicValue } from '../../domain';
// import { faker } from '@faker-js/faker';

// import { Sortable } from './Sortable';
// import { SortableReference } from './SortableReference';
// import { SortableValue } from './SortableValue';

// class UserPK extends EntityKey {
//   constructor(readonly id: number) {
//     super();
//   }

//   protected getAtomicValues(): ValueObjectAtomicValue {
//     return this.id;
//   }
// }

// class User extends Entity<UserPK> {
//   constructor(readonly primaryKey: UserPK) {
//     super();
//   }
// }

// class BidPK extends EntityKey {
//   constructor(readonly id: string) {
//     super();
//   }

//   protected getAtomicValues(): ValueObjectAtomicValue {
//     return this.id;
//   }
// }

// class Bid extends Entity<BidPK> {
//   constructor(
//     readonly primaryKey: BidPK,
//     userPK: UserPK,
//   ) {
//     super();
//   }
// }

// export class UserIdSortable extends Sortable<User> {
//   protected initialize(): void {
//     this.addSort((item) => item.primaryKey.id);
//   }
// }

// export class BidIdSortable extends Sortable<Bid> {
//   protected initialize(): void {
//     this.addSort((item) => item.primaryKey.id);
//   }
// }

// export class BidUserSortable extends SortableReference<Bid, User> {
//   protected initialize(): void {
//     // this.addSort();
//     this.addSort((bid) => bid.primaryKey.id);
//     this.sor
//   }
// }

// const users = faker.helpers.multiple<User>(() => new User(new UserPK(faker.number.int({ min: -1000, max: 1000 }))), { count: 20 });
// const bids = faker.helpers.multiple<Bid>(() => new Bid(new BidPK(faker.string.uuid()), faker.helpers.arrayElement(users).primaryKey), { count: 100 });

// const userIdSortable = new UserIdSortable(SortableValue.ASC);
// const bidIdSortable = new BidIdSortable(SortableValue.ASC);
// const bidUserSortable = new BidUserSortable([userIdSortable]);

// console.log(bidUserSortable.sort(bids));

// // export class UserBidSortable extends SortableReference<User, Bid> {}
// // export class BidIdSortable extends Sortable<Bid> {}

// // new UserIdSortable(SortableValue.ASC);
// // new UserBidSortable(new BidIdSortable(SortableValue.ASC));

export {};
