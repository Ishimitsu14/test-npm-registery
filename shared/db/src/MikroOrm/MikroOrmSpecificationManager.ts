// import { ConstructorType } from '@ddd/core';
// import { ISnapshotEntity } from '@ddd/infra';
// import { AndSpecification, EmptySpecification, NotSpecification, OrSpecification, Specification, SpecificationInferEntity, SpecificationManager, WhereInPKSpecification } from '@ddd/specifications';

// import { IMikroOrmRepository } from './Interfaces';
// import { MikroOrmSpecificationResolver } from './Specifications';
// import { AndSpecificationResolver, EmptySpecificationResolver, NotSpecificationResolver, OrSpecificationResolver, WhereInPKSpecificationResolver } from './Specifications/SystemResolvers';
// import { MikroOrmPredicate, MikroOrmSpecificationPredicate } from './types';

// export class MikroOrmSpecificationManager extends SpecificationManager<MikroOrmSpecificationPredicate<any, any>> {
//   constructor() {
//     super();

//     this.registerSpecificationResolver(EmptySpecification, new EmptySpecificationResolver());
//     this.registerSpecificationResolver(AndSpecification, new AndSpecificationResolver());
//     this.registerSpecificationResolver(OrSpecification, new OrSpecificationResolver());
//     this.registerSpecificationResolver(NotSpecification, new NotSpecificationResolver());
//     this.registerSpecificationResolver(WhereInPKSpecification, new WhereInPKSpecificationResolver());
//   }

//   registerSpecificationResolver<TSpec extends Specification<any>>(specificationType: ConstructorType<TSpec>, specificationResolver: MikroOrmSpecificationResolver<any, any>): void {
//     specificationResolver.setManager(this);
//     super.registerSpecificationResolver(specificationType, specificationResolver);
//   }

//   combineFilters(filters: MikroOrmPredicate<any>[]): MikroOrmPredicate<any> {
//     return (builder) => filters.reduce((builder, filter) => filter(builder), builder);
//   }

//   resolve<TSpec extends Specification<any>, TSnapshot extends ISnapshotEntity<SpecificationInferEntity<TSpec>>>(
//     specification: TSpec,
//     repository: IMikroOrmRepository<SpecificationInferEntity<TSpec>, TSnapshot>,
//   ): Promise<MikroOrmPredicate<TSnapshot>> {
//     return super.resolve(specification, repository);
//   }

//   // async wrapQuery<TEntity extends Entity, TSnapshot extends ISnapshotEntity<TEntity>>(query: Query<TEntity>, usePageable: boolean = false) {
//   //   const specWrapper = await this.wrapSpecification(query.rootSpecification);
//   //   const sortableWrapper = this.wrapSortable<TSnapshot>(query.sorts);
//   //   const pageableWrapper = usePageable && this.wrapPageable<TSnapshot>(query.pageable);

//   //   return this.wrapCombine<TSnapshot>([specWrapper, sortableWrapper, pageableWrapper].filter(Boolean));
//   // }

//   // wrapPageable<TSnapshot extends ISnapshotEntity<any>>(pageable: Pageable): MikroOrmQueryBuilderPredicate<TSnapshot> {
//   //   return (qb) => {
//   //     return qb.offset(pageable.skip).limit(pageable.limit);
//   //   };
//   // }

//   // wrapSortable<TSnapshot extends ISnapshotEntity<any>>(sortables: Sortable[]): MikroOrmQueryBuilderPredicate<TSnapshot> {
//   //   return (qb) => qb;
//   // }

//   // getInternalRepository<TSnapshot extends ISnapshotEntity<any>>(manager: SqlEntityManager<PostgreSqlDriver>, snapshotType: ConstructorType<TSnapshot>) {
//   //   return manager.getRepository(snapshotType) as SqlEntityRepository<TSnapshot>;
//   // }

//   // createEmptyQB<TSnapshot extends ISnapshotEntity<any>>(manager: SqlEntityManager<PostgreSqlDriver>, snapshotType: ConstructorType<TSnapshot>) {
//   //   const repository = this.getInternalRepository(manager, snapshotType);
//   //   return repository.createQueryBuilder();
//   // }

//   // wrapSpecifications<TSnapshot extends ISnapshotEntity<any>>(builder: QueryBuilder<TSnapshot>, rootSpecification: Specification<any>) {
//   //   this.resolve(rootSpecification, {
//   //     manager: this,
//   //     repository: null
//   //   })
//   // }
// }

export {};
