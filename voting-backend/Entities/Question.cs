using System.Collections.Generic;

namespace WebApi.Entities
{
    public class Question
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public string AdditionalData { get; set; }
        public bool Active { get; set; }
        public Voting Voting { get; set; }
        public List<Answer> Answers { get; set; }
    }
}