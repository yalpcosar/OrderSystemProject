gitusing Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataAccess.Concrete.EntityFramework.Contexts
{
    public class ProjectDbContextFactory : IDesignTimeDbContextFactory<ProjectDbContext>
    {
        public ProjectDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<ProjectDbContext>();
            var connectionString = configuration.GetConnectionString("DArchPgContext");
            
            builder.UseNpgsql(connectionString);

            return new ProjectDbContext(builder.Options, configuration);
        }
    }
}

