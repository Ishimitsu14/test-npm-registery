export type CompositeFilter<TFilter extends Record<string, any>> = TFilter & {
  AND?: CompositeFilter<TFilter>[];
  OR?: CompositeFilter<TFilter>[];
  NOT?: CompositeFilter<TFilter>;
};

export type CompositeFilterInferFilter<T> = T extends CompositeFilter<infer Filter> ? Filter : never;
