using AgendamentosApp.Application.Services;
using AgendamentosApp.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AgendamentosApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly TokenService _tokenService;

    public AuthController(AppDbContext context, TokenService tokenService)
    {
        _context = context;
        _tokenService = tokenService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var usuario = await _context.Usuarios.FirstOrDefaultAsync(u => u.Email == request.Email);

        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
            return Unauthorized(new { message = "Email ou senha inválidos." });

        if (!usuario.Ativo)
            return Unauthorized(new { message = "Usuário inativo." });

        var token = _tokenService.GenerateToken(usuario);

        return Ok(new { token, nome = usuario.Nome, perfil = usuario.Perfil.ToString() });
    }
}

public record LoginRequest(string Email, string Senha);