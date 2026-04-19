using AgendamentosApp.Domain.Enums;

namespace AgendamentosApp.Domain.Entities;

public class Agendamento
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public string TipoAtendimento { get; set; } = string.Empty;
    public DateTime DataHorario { get; set; }
    public string? Observacoes { get; set; }
    public StatusAgendamento Status { get; set; } = StatusAgendamento.PendenteConfirmacao;
    public string? JustificativaRecusa { get; set; }
    public string? ResumoAtendimento { get; set; }
    public DateTime DataCriacao { get; set; } = DateTime.UtcNow;
    public DateTime? DataConfirmacao { get; set; }
    public DateTime? DataCancelamento { get; set; }
    public Guid ClienteId { get; set; }
    public Usuario? Cliente { get; set; }
    public Guid AtendenteId { get; set; }
    public Usuario? Atendente { get; set; }
}