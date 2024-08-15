import { Aggregation } from '../Aggregation';
import { Sortable } from '../sortable';
import { Specification } from '../specifications';

export function SpecificationIsNotCorrect(specification: Specification<any>) {
  return `QueryResolver: specification is not correct: ${JSON.stringify(specification)}`;
}

export function SortableIsNotCorrect(sortable: Sortable<any>) {
  return `QueryResolver: sortable is not correct: ${JSON.stringify(sortable)}`;
}

export function SpecificationResolverIsNotDefined(specificationTypeName: string) {
  return `Specification resolver is not defined for specification: ${specificationTypeName}`;
}

export function SortableResolverIsNotDefined(sortableTypeName: string) {
  return `QueryResolver: Sortable resolver is not defined for sortable: ${sortableTypeName}`;
}

export function SpecificationResolverNeedSetManager(specificationTypeName: string) {
  return `Specification resolver needs to set manager: ${specificationTypeName}`;
}

export function AndSpecificationResolverIsNotDefined(specificationTypeName: string) {
  return `A original specification "${specificationTypeName}" has no predicates, but it does have child specifications. A AndSpecification has been selected, but its resolver has not been defined.`;
}

export function EmptySpecificationResolverIsNotDefined(specificationTypeName: string) {
  return `The original specification "${specificationTypeName}" has no predicates, an EmptySpecification was selected, but its Resolver is not defined.`;
}

export function AggregationResolverIsNotDefined(specificationTypeName: string) {
  return `Aggregation resolver is not defined for Aggregation: ${specificationTypeName}`;
}

export function AggregationIsNotCorrect(aggregator: Aggregation<any>) {
  return `Aggregation is not correct: ${JSON.stringify(aggregator)}`;
}
