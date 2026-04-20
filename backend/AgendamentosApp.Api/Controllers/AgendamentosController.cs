using System.Security.Claims;
using AgendamentosApp.Domain.Entities;
using AgendamentosApp.Domain.Enums;
using AgendamentosApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgendamentosApp.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AgendamentosController : ControllerBase
{
    private readonly AppDbContext _context;

    public AgendamentosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CriarAgendamentoRequest request)
    {

        var clienteIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!Guid.TryParse(clienteIdStr, out var clienteId))
            return Unauthorized();

        if (request.DataHorario <= DateTime.Now)
            return BadRequest(new { message = "Não é possível realizar agendamentos no passado." });

        var conflito = await _context.Agendamentos.AnyAsync(a => 
            a.AtendenteId == request.AtendenteId && 
            a.DataHorario == request.DataHorario &&
            a.Status != StatusAgendamento.Cancelado &&
            a.Status != StatusAgendamento.Recusado);

        if (conflito)
            return BadRequest(new { message = "Este horário já está ocupado para este atendente." });

        var agendamento = new Agendamento
        {
            ClienteId = clienteId,
            AtendenteId = request.AtendenteId,
            Titulo = request.Titulo,
            Descricao = request.Descricao,
            TipoAtendimento = request.TipoAtendimento,
            DataHorario = request.DataHorario,
            Status = StatusAgendamento.PendenteConfirmacao
        };

        _context.Agendamentos.Add(agendamento);
        await _context.SaveChangesAsync();

        return Ok(agendamento);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> AlterarStatus(Guid id, [FromBody] AlterarStatusRequest request)
    {
        var agendamento = await _context.Agendamentos.FindAsync(id);
        if (agendamento == null) 
            return NotFound(new { message = "Agendamento não encontrado." });
            
        agendamento.Status = (Domain.Enums.StatusAgendamento)request.Status;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Status alterado com sucesso." });
    }
}

public record CriarAgendamentoRequest(Guid AtendenteId, string Titulo, string? Descricao, string TipoAtendimento, DateTime DataHorario);
public record AlterarStatusRequest(int Status, string? Justificativa = null, string? ResumoAtendimento = null);