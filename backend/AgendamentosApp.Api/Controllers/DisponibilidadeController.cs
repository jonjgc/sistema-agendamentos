using AgendamentosApp.Domain.Entities;
using AgendamentosApp.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgendamentosApp.Api.Controllers;

[Authorize(Roles = "Administrador")] // Apenas Admin gerencia horários
[ApiController]
[Route("api/[controller]")]
public class DisponibilidadeController : ControllerBase
{
    private readonly AppDbContext _context;

    public DisponibilidadeController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CriarDisponibilidadeRequest request)
    {
        // Valida se o usuário informado é realmente um Atendente
        var atendente = await _context.Usuarios.FindAsync(request.AtendenteId);
        if (atendente == null || atendente.Perfil != Domain.Enums.TipoUsuario.Atendente)
            return BadRequest(new { message = "O usuário informado não existe ou não é um Atendente." });

        if (request.HoraInicial >= request.HoraFinal)
            return BadRequest(new { message = "A hora inicial deve ser menor que a hora final." });

        var disponibilidade = new Disponibilidade
        {
            AtendenteId = request.AtendenteId,
            DiaSemana = request.DiaSemana,
            HoraInicial = request.HoraInicial,
            HoraFinal = request.HoraFinal
        };

        _context.Disponibilidades.Add(disponibilidade);
        await _context.SaveChangesAsync();

        return Ok(disponibilidade);
    }

    [HttpGet("atendente/{atendenteId}")]
    [AllowAnonymous] // Qualquer pessoa logada ou não pode ver os horários para agendar
    public async Task<IActionResult> GetByAtendente(Guid atendenteId)
    {
        var disponibilidades = await _context.Disponibilidades
            .Where(d => d.AtendenteId == atendenteId && d.Ativo)
            .ToListAsync();

        return Ok(disponibilidades);
    }
}

public record CriarDisponibilidadeRequest(Guid AtendenteId, int DiaSemana, TimeSpan HoraInicial, TimeSpan HoraFinal);