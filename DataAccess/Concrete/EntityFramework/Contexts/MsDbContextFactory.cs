using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DataAccess.Concrete.EntityFramework.Contexts
{
    public class MsDbContextFactory : IDesignTimeDbContextFactory<MsDbContext>
    {
        public MsDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: false)
                .AddJsonFile($"appsettings.{System.Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development"}.json", optional: true)
                .Build();

            var builder = new DbContextOptionsBuilder<MsDbContext>();
            var connectionString = configuration.GetConnectionString("DArchMsContext");
            
            builder.UseSqlServer(connectionString)
                   .ConfigureWarnings(warnings => warnings.Ignore(RelationalEventId.PendingModelChangesWarning));

            return new MsDbContext(builder.Options, configuration);
        }
    }
}

