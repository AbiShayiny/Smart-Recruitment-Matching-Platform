using Backend.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Backend.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260914000000_AddJobSeekerProfileDetails")]
    public partial class AddJobSeekerProfileDetails : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "JobSeekerProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfessionalSummary",
                table: "JobSeekerProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ProfessionalTitle",
                table: "JobSeekerProfiles",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "JobSeekerProfiles");

            migrationBuilder.DropColumn(
                name: "ProfessionalSummary",
                table: "JobSeekerProfiles");

            migrationBuilder.DropColumn(
                name: "ProfessionalTitle",
                table: "JobSeekerProfiles");
        }
    }
}
