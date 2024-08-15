// import { getClassOfInstance } from '@berish/class';
// import { ConstructorType, NullableObject } from '@ddd/core';

// import { IQueryRepository } from '../QueryRepository';
// import { Sortable, SortableResolver } from '../sortable';
// import { SpecificationIsNotCorrect, SpecificationResolverIsNotDefined } from './errors';
// import { Specification } from './Specification';
// import { SpecificationResolver } from './SpecificationResolver';
// import { AndSpecification, EmptySpecification } from './system';
// import { SpecificationInferEntity, SpecificationPredicate, SpecificationPredicateInferFilter } from './types';

// export abstract class SpecificationManager<TPredicate extends SpecificationPredicate<any, any, unknown>> {
//   private readonly _specificationResolvers: Map<ConstructorType<Specification<any>>, SpecificationResolver<TPredicate>> = new Map();
//   private readonly _sortableResolvers: Map<ConstructorType<Sortable<any>>, SortableResolver<TPredicate>> = new Map();

//   registerSpecificationResolver<TSpec extends Specification<any>>(specificationType: ConstructorType<TSpec>, specificationResolver: SpecificationResolver<TPredicate>) {
//     this._specificationResolvers.set(specificationType, specificationResolver);
//   }

//   registerSortableResolver<TSortable extends Sortable<any>>(sortableType: ConstructorType<TSortable>, resolver: SortableResolver<TPredicate>) {
//     this._sortableResolvers.set(sortableType, resolver);
//   }

//   abstract combineFilters(filters: SpecificationPredicateInferFilter<TPredicate>[]): SpecificationPredicateInferFilter<TPredicate>;

//   getResult<TSpec extends Specification<any>>(specification: TSpec, repo: IQueryRepository<SpecificationInferEntity<TSpec>>): Promise<SpecificationPredicateInferFilter<TPredicate>[]> {
//     const specificationType = this.getSpecificationType(specification);
//     const nativeResolver = this.getNativeResolver(specificationType);

//     // Есть прямой обработчик
//     if (NullableObject.hasValue(nativeResolver)) {
//       const rawPredicates = nativeResolver.predicates.slice();
//       const rawFilters = Promise.all(rawPredicates.map((predicate) => predicate(specification, repo))) as Promise<SpecificationPredicateInferFilter<TPredicate>[]>;

//       if (specification.childSpecifications.length > 0) {
//         const childFilters = this.getResult(specification.childSpecifications.length === 1 ? specification.childSpecifications[0] : AndSpecification.create(specification.childSpecifications), repo);
//         return Promise.all([rawFilters, childFilters]).then(([raw, child]) => [...raw, ...child]);
//       }

//       return rawFilters;
//     }

//     // Прямой обработчик не найден, но у него есть свои предикаты. Тогда ошибка, что не определили специальный резолвер
//     if (specification.predicates.length > 0) throw new TypeError(SpecificationResolverIsNotDefined(specificationType.name));

//     // Прямой обработчик не найден, но спецификация комбинированная (имеет внутренние спецификации)

//     // Состоит из 0 элементов, возврат пустой спецификации
//     if (specification.childSpecifications.length === 0) return this.getResult(EmptySpecification.create(), repo);

//     // Состоит из 1 элемента, возвраем единственную как главную
//     if (specification.childSpecifications.length === 1) return this.getResult(specification.childSpecifications[0], repo);

//     // Состоит больше чем из 1 элемента, объединяем в одну
//     if (specification.childSpecifications.length > 1) return this.getResult(AndSpecification.create(specification.childSpecifications), repo);

//     // Если что-то пошло не так, во всех остальных случаях ошибка, что резолвер не определен
//     throw new TypeError(SpecificationResolverIsNotDefined(specificationType.name));
//   }

//   async resolve<TSpec extends Specification<any>>(specification: TSpec, repository: IQueryRepository<SpecificationInferEntity<TSpec>>): Promise<SpecificationPredicateInferFilter<TPredicate>> {
//     const filters = await this.getResult(specification, repository);
//     return this.combineFilters(filters) as SpecificationPredicateInferFilter<TPredicate>;
//   }

//   /**
//    * Получает прямой объект резолвера спецификации (или NullableObject если резолвер не найден)
//    * @param specificationType
//    * @returns
//    */
//   protected getNativeResolver<TSpec extends Specification<any>>(specificationType: ConstructorType<TSpec>): SpecificationResolver<TPredicate> | NullableObject {
//     return NullableObject(this._specificationResolvers.get(specificationType));
//   }

//   /**
//    * Получает тип спецификации (класс)
//    * @param specification
//    * @returns
//    */
//   protected getSpecificationType<TSpec extends Specification<any>>(specification: TSpec): ConstructorType<TSpec> {
//     const specificationType = getClassOfInstance(specification);
//     if (!specificationType || !Specification.isExtends(specification)) throw new TypeError(SpecificationIsNotCorrect(specification));

//     return specificationType;
//   }
// }

export {};
