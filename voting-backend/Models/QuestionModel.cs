using System.Collections.Generic;
using WebApi.Entities;

namespace WebApi.Models.Users
{
    public class QuestionModel
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public bool Active { get; set; }
        public string AdditionalData { get; set; }
        public List<AnswerModel> Answers  { get; set; }
    }
}