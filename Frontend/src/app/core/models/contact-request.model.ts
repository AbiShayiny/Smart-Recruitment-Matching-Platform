export interface CreateContactRequestDto {
  applicationId: number;
  message: string;
}

export interface ContactRequestModel {
  id: number;
  applicationId: number;
  jobTitle: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
