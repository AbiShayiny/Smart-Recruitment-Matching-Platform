using System.Globalization;
using System.Text.RegularExpressions;
using Backend.DTOs.Matching;
using Backend.Models.JobSeeker;
using Backend.Repositories.Jobseeker.Interfaces;
using Backend.Repositories.Vacancy.Interfaces;
using Backend.Services.Matching.Interfaces;

namespace Backend.Services.Matching.Implementations
{
    public class MatchingService : IMatchingService
    {
        private readonly IJobSeekerRepository _jobSeekerRepository;
        private readonly IVacancyRepository _vacancyRepository;

        public MatchingService(
            IJobSeekerRepository jobSeekerRepository,
            IVacancyRepository vacancyRepository)
        {
            _jobSeekerRepository = jobSeekerRepository;
            _vacancyRepository = vacancyRepository;
        }

        public async Task<MatchingResultDto?> CalculateMatchAsync(
            int userId,
            int vacancyId)
        {
            var profile = await _jobSeekerRepository
                .GetByUserIdAsync(userId);

            var vacancy = await _vacancyRepository
                .GetByIdAsync(vacancyId);

            if (profile == null || vacancy == null)
            {
                return null;
            }

            var requiredSkills = SplitSkills(vacancy.RequiredSkills);
            var profileSkills = new HashSet<string>(
                SplitSkills(profile.Skills),
                StringComparer.OrdinalIgnoreCase);

            var matchedSkills = requiredSkills
                .Where(profileSkills.Contains)
                .ToList();

            var missingSkills = requiredSkills
                .Where(skill => !profileSkills.Contains(skill))
                .ToList();

            var skillScore = requiredSkills.Count == 0
                ? 50m
                : (decimal)matchedSkills.Count / requiredSkills.Count * 50m;

            var experienceScore = CalculateExperienceScore(
                profile.Experience,
                vacancy.RequiredExperience);

            var educationScore = CalculateEducationScore(
                profile.Education,
                vacancy.Education);

            var locationScore = CalculateLocationScore(
                profile.Location,
                vacancy.Location);

            var completenessScore = CalculateCompletenessScore(profile);
            var maintenanceScore = CalculateMaintenanceScore(profile);

            // The current CV records contain file metadata, not extracted content.
            decimal? cvConsistencyScore = null;
            var otherScore = completenessScore + maintenanceScore;

            return new MatchingResultDto
            {
                SkillScore = Round(skillScore),
                ExperienceScore = Round(experienceScore),
                EducationScore = Round(educationScore),
                LocationScore = Round(locationScore),
                OtherScore = Round(otherScore),
                CvProfileConsistencyScore = cvConsistencyScore,
                ProfileCompletenessScore = Round(completenessScore),
                ProfileMaintenanceScore = Round(maintenanceScore),
                MatchScore = Round(
                    skillScore + experienceScore + educationScore +
                    locationScore + otherScore),
                MatchedSkills = matchedSkills,
                MissingSkills = missingSkills
            };
        }

        private static List<string> SplitSkills(string skills)
        {
            return skills
                .Split(
                    new[] { ',', ';' },
                    StringSplitOptions.RemoveEmptyEntries |
                    StringSplitOptions.TrimEntries)
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }

        private static decimal CalculateExperienceScore(
            string candidateExperience,
            string? requiredExperience)
        {
            if (string.IsNullOrWhiteSpace(requiredExperience))
            {
                return 20m;
            }

            if (string.IsNullOrWhiteSpace(candidateExperience))
            {
                return 0m;
            }

            var candidateYears = ReadFirstNumber(candidateExperience);
            var requiredYears = ReadFirstNumber(requiredExperience);

            if (candidateYears.HasValue && requiredYears.HasValue)
            {
                if (requiredYears.Value <= 0 ||
                    candidateYears.Value >= requiredYears.Value)
                {
                    return 20m;
                }

                return candidateYears.Value / requiredYears.Value * 20m;
            }

            return Normalize(candidateExperience) == Normalize(requiredExperience)
                ? 20m
                : 0m;
        }

        private static decimal? ReadFirstNumber(string value)
        {
            var match = Regex.Match(value, @"\d+(\.\d+)?");

            if (match.Success && decimal.TryParse(
                match.Value,
                NumberStyles.Number,
                CultureInfo.InvariantCulture,
                out var number))
            {
                return number;
            }

            return null;
        }

        private static decimal CalculateEducationScore(
            string candidateEducation,
            string? requiredEducation)
        {
            if (string.IsNullOrWhiteSpace(requiredEducation))
            {
                return 10m;
            }

            if (string.IsNullOrWhiteSpace(candidateEducation))
            {
                return 0m;
            }

            var candidate = Normalize(candidateEducation);
            var required = Normalize(requiredEducation);

            if (candidate.Contains(required) || required.Contains(candidate))
            {
                return 10m;
            }

            var candidateLevel = GetEducationLevel(candidate);
            var requiredLevel = GetEducationLevel(required);

            return candidateLevel.HasValue &&
                requiredLevel.HasValue &&
                candidateLevel.Value >= requiredLevel.Value
                    ? 10m
                    : 0m;
        }

        private static int? GetEducationLevel(string education)
        {
            if (education.Contains("phd") || education.Contains("doctor"))
            {
                return 4;
            }

            if (education.Contains("master") || education.Contains("msc"))
            {
                return 3;
            }

            if (education.Contains("bachelor") ||
                education.Contains("bsc") ||
                education.Contains("degree"))
            {
                return 2;
            }

            if (education.Contains("diploma"))
            {
                return 1;
            }

            return null;
        }

        private static decimal CalculateLocationScore(
            string candidateLocation,
            string? requiredLocation)
        {
            if (string.IsNullOrWhiteSpace(requiredLocation))
            {
                return 10m;
            }

            return Normalize(candidateLocation) == Normalize(requiredLocation)
                ? 10m
                : 0m;
        }

        private static decimal CalculateCompletenessScore(
            JobSeekerProfile profile)
        {
            var completedFields = 0;

            if (!string.IsNullOrWhiteSpace(profile.Skills)) completedFields++;
            if (!string.IsNullOrWhiteSpace(profile.Experience)) completedFields++;
            if (!string.IsNullOrWhiteSpace(profile.Education)) completedFields++;
            if (!string.IsNullOrWhiteSpace(profile.Location)) completedFields++;

            return (decimal)completedFields / 4m * 3m;
        }

        private static decimal CalculateMaintenanceScore(
            JobSeekerProfile profile)
        {
            var mostRecentDate = profile.UpdatedAt != default
                ? profile.UpdatedAt
                : profile.CreatedAt;

            if (mostRecentDate == default)
            {
                return 0m;
            }

            var ageInDays = (DateTime.UtcNow - mostRecentDate).TotalDays;

            if (ageInDays <= 90)
            {
                return 2m;
            }

            return ageInDays <= 365 ? 1m : 0m;
        }

        private static string Normalize(string value)
        {
            return string.Join(
                " ",
                value.Trim().ToLowerInvariant()
                    .Split(' ', StringSplitOptions.RemoveEmptyEntries));
        }

        private static decimal Round(decimal score)
        {
            return Math.Round(score, 2);
        }
    }
}
