export interface IApplicantReviewed {
  applicantId: string;
  inspectionId: string;
  correlationId: string;
  externalUserId: string;
  levelName: string;
  type: string;
  reviewResult: {
    reviewAnswer: 'GREEN' | 'RED';
  };
  reviewStatus: string;
  createdAtMs: string;
}
