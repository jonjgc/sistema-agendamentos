using AgendamentosApp.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgendamentosApp.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Agendamento> Agendamentos { get; set; }
    public DbSet<Disponibilidade> Disponibilidades { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Exemplo rápido de Fluent API para garantir e-mail e CPF únicos
        modelBuilder.Entity<Usuario>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Usuario>().HasIndex(u => u.Cpf).IsUnique();
    }
}