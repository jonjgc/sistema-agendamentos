namespace AgendamentosApp.Domain.Entities;

public class Disponibilidade
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int DiaSemana { get; set; } // 0 = Domingo, 1 = Segunda...
    public TimeSpan HoraInicial { get; set; }
    public TimeSpan HoraFinal { get; set; }
    public bool Ativo { get; set; } = true;

    // Relacionamento
    public Guid AtendenteId { get; set; }
    public Usuario? Atendente { get; set; }
}