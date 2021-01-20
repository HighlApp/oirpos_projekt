using System.Collections.Generic;

namespace WebApi.Models.Users
{
    public class VotingModel
    {
        public string Name { get; set; }
        public List<QuestionModel> Questions { get; set; }
    }
}