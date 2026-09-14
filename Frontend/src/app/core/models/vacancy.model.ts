export interface UpdateVacancyDto {
  jobTitle: string;
  jobDescription: string;
  requiredSkills: string;
  requiredExperience: string | null;
  education: string | null;
  location: string | null;
  employmentType: string | null;
  closingDate: string | null;
}

export interface CreateVacancyDto extends UpdateVacancyDto {
  companyId: number;
}

export interface VacancyModel extends CreateVacancyDto {
  vacancyId: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}

export function parseVacancyId(value: string | null): number | null {
  if (!value || !/^[1-9]\d*$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id <= 2147483647 ? id : null;
}

export function vacancyValidation(dto: UpdateVacancyDto): string {
  if (!dto.jobTitle.trim() || !dto.jobDescription.trim() || !dto.requiredSkills.trim()) {
    return 'Enter a job title, description and at least one required skill.';
  }
  const limits: [string | null, number, string][] = [
    [dto.jobTitle, 150, 'Job title'], [dto.jobDescription, 2000, 'Description'],
    [dto.requiredSkills, 1000, 'Required skills'], [dto.requiredExperience, 100, 'Experience'],
    [dto.education, 150, 'Education'], [dto.location, 200, 'Location'],
    [dto.employmentType, 50, 'Employment type']
  ];
  const invalid = limits.find(([value, limit]) => (value?.length ?? 0) > limit);
  return invalid ? `${invalid[2]} must be ${invalid[1]} characters or fewer.` : '';
}
