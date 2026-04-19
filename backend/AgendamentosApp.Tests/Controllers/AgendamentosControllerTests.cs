using System.Security.Claims;
using AgendamentosApp.Api.Controllers;
using AgendamentosApp.Domain.Entities;
using AgendamentosApp.Domain.Enums;
using AgendamentosApp.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace AgendamentosApp.Tests.Controllers;

public class AgendamentosControllerTests
{
    private AppDbContext GetDatabase()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        return new AppDbContext(options);
    }

    [Fact]
    public async Task Create_ShouldReturnBadRequest_WhenDateIsInPast()
    {
        var context = GetDatabase();
        var controller = new AgendamentosController(context);
        var clienteIdMock = Guid.NewGuid();
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, clienteIdMock.ToString()),
            new Claim(ClaimTypes.Role, "Cliente")
        };
        var identity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = claimsPrincipal }
        };

        var request = new CriarAgendamentoRequest(
            AtendenteId: Guid.NewGuid(),
            Titulo: "Teste Unitário",
            Descricao: "Tentando agendar no passado",
            TipoAtendimento: "Consulta",
            DataHorario: DateTime.Now.AddDays(-1)
        );

        var result = await controller.Create(request);
        var badRequest = Assert.IsType<BadRequestObjectResult>(result);
        var value = badRequest.Value;
        Assert.NotNull(value);
        
        var messageProperty = value.GetType().GetProperty("message");
        Assert.NotNull(messageProperty);
        
        var message = messageProperty.GetValue(value)?.ToString();
        Assert.Contains("passado", message);
    }
}