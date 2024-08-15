import { Specification, SpecificationResolver } from '@ddd/specifications';

import { MockQueryResolver } from '../MockQueryResolver';
import { MockSpecificationPredicate } from '../types';

export abstract class MockSpecificationResolver<TSpecification extends Specification<any>> extends SpecificationResolver<MockSpecificationPredicate<TSpecification>> {
  get queryResolver(): MockQueryResolver {
    return <MockQueryResolver>super.queryResolver;
  }
}
