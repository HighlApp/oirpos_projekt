using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using WebApi.Entities;

namespace WebApi.Helpers
{
    public class DataContext : DbContext
    {
        protected readonly IConfiguration Configuration;

        public DataContext(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            options.UseNpgsql(Configuration.GetConnectionString("WebApiDatabase"));
        }

        public DbSet<User> Users { get; set; }
        
        public DbSet<Voting> Votings { get; set; }
        
        public DbSet<Question> Questions { get; set; }
        
        public DbSet<Token> Tokens { get; set; }
        
        public DbSet<Answer> Answers { get; set; }
        
    }
}