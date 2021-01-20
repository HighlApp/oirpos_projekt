using System.Collections.Generic;
using WebApi.Models.Users;
using WebApi.Services;

namespace WebApi.Entities
{
    public class Voting
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Question> Questions { get; set; }
        public List<Token> Tokens { get; set; }
    }
}