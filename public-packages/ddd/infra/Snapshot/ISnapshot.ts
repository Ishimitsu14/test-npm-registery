export interface ISnapshot<Domain> {
  applyDomain(domain: Domain): void;
  toDomain(): Domain;
}
