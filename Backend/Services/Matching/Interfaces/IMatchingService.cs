using Backend.DTOs.Matching;

namespace Backend.Services.Matching.Interfaces
{
    public interface IMatchingService
    {
        Task<MatchingResultDto?> CalculateMatchAsync(
            int userId,
            int vacancyId);
    }
}
