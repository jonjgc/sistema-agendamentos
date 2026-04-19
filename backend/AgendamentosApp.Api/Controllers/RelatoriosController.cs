using AgendamentosApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgendamentosApp.Api.Controllers;

[Authorize(Roles = "Administrador")] 
[ApiController]
[Route("api/[controller]")]
public class RelatoriosController : ControllerBase
{
    private readonly AppDbContext _context;

    public RelatoriosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("estatisticas")]
    public async Task<IActionResult> GetEstatisticas([FromQuery] DateTime? dataInicio, [FromQuery] DateTime? dataFim)
    {
        var query = _context.Agendamentos.AsQueryable();

        if (dataInicio.HasValue) query = query.Where(a => a.DataHorario >= dataInicio.Value);
        if (dataFim.HasValue) query = query.Where(a => a.DataHorario <= dataFim.Value);

        var totalPorAtendente = await query
            .Include(a => a.Atendente)
            .GroupBy(a => a.Atendente!.Nome)
            .Select(g => new { Atendente = g.Key, Total = g.Count() })
            .ToListAsync();

        var statusGeral = await query
            .GroupBy(a => a.Status)
            .Select(g => new { Status = g.Key.ToString(), Total = g.Count() })
            .ToListAsync();

        var taxaAtendimentos = new
        {
            Realizados = await query.CountAsync(a => a.Status == Domain.Enums.StatusAgendamento.Realizado),
            Cancelados = await query.CountAsync(a => a.Status == Domain.Enums.StatusAgendamento.Cancelado)
        };

        var distribuicaoTipo = await query
            .GroupBy(a => a.TipoAtendimento)
            .Select(g => new { Tipo = g.Key, Total = g.Count() })
            .ToListAsync();

        return Ok(new
        {
            TotalPorAtendente = totalPorAtendente,
            AgendamentosPorStatus = statusGeral,
            TaxaRealizadosVsCancelados = taxaAtendimentos,
            DistribuicaoPorTipo = distribuicaoTipo
        });
    }

    [HttpGet("detalhado")]
    public async Task<IActionResult> GetRelatorioDetalhado([FromQuery] DateTime? dataInicio, [FromQuery] DateTime? dataFim)
    {
        var query = _context.Agendamentos
            .Include(a => a.Cliente)
            .Include(a => a.Atendente)
            .AsQueryable();

        if (dataInicio.HasValue) query = query.Where(a => a.DataHorario >= dataInicio.Value);
        if (dataFim.HasValue) query = query.Where(a => a.DataHorario <= dataFim.Value);

        var relatorio = await query
            .OrderByDescending(a => a.DataHorario)
            .Select(a => new
            {
                NomeCliente = a.Cliente!.Nome,
                NomeAtendente = a.Atendente!.Nome,
                DataAtendimento = a.DataHorario.ToString("yyyy-MM-dd"),
                Horario = a.DataHorario.ToString("HH:mm"),
                TipoAtendimento = a.TipoAtendimento,
                Status = a.Status.ToString(),
                DataCriacao = a.DataCriacao,
                DataConfirmacao = a.DataConfirmacao,
                DataCancelamento = a.DataCancelamento,
                Justificativa = a.JustificativaRecusa
            })
            .ToListAsync();

        return Ok(relatorio);
    }
}