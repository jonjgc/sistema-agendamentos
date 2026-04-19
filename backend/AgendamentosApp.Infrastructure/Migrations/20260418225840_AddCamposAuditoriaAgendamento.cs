using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgendamentosApp.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCamposAuditoriaAgendamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "DataCancelamento",
                table: "Agendamentos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataConfirmacao",
                table: "Agendamentos",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "DataCriacao",
                table: "Agendamentos",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DataCancelamento",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "DataConfirmacao",
                table: "Agendamentos");

            migrationBuilder.DropColumn(
                name: "DataCriacao",
                table: "Agendamentos");
        }
    }
}
