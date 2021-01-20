using System.Collections.Generic;

namespace WebApi.Models.Users
{
    public class VotingModelWithId
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<QuestionModelWithId> Questions { get; set; }
    }
}