using AgendamentosApp.Domain.Enums;

namespace AgendamentosApp.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Nome { get; set; } = string.Empty;
    public TipoUsuario Perfil { get; set; }
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty; // Nunca salvamos a senha em texto puro
    
    // Dados específicos do Cliente
    public string? Cpf { get; set; }
    public DateTime? DataNascimento { get; set; }
    public string? Telefone { get; set; }
    public string? Observacoes { get; set; }
    public bool Ativo { get; set; } = true;
}