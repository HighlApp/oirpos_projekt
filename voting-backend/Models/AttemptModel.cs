using WebApi.Entities;

namespace WebApi.Models.Users
{
    public class AttemptModel
    {
        public string Title { get; set; }
        public QuestionModelWithId Question { get; set; }
    }
}