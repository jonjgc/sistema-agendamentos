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
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsuariosController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize(Roles = "Administrador")]
    public async Task<IActionResult> GetAll()
    {
        var usuarios = await _context.Usuarios
            .Select(u => new { u.Id, u.Nome, u.Email, u.Perfil, u.Ativo })
            .ToListAsync();
        return Ok(usuarios);
    }

    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> Create([FromBody] Usuario novoUsuario)
    {
        if (novoUsuario.Perfil == TipoUsuario.Administrador || novoUsuario.Perfil == TipoUsuario.Atendente)
        {
            if (!User.IsInRole("Administrador"))
                return Forbid("Apenas administradores podem criar perfis administrativos.");
        }

        novoUsuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(novoUsuario.SenhaHash);
        
        _context.Usuarios.Add(novoUsuario);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), new { id = novoUsuario.Id }, new { novoUsuario.Id, novoUsuario.Nome });
    }
}