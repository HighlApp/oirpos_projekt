using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Services
{

    public interface IAnswerService
    {
        Answer Create(Answer answer);
    }

    public class AnswerService : IAnswerService
    {

        private DataContext _context;

        public AnswerService(DataContext context)
        {
            _context = context;
        }

        public Answer Create(Answer answer)
        {

            _context.Answers.Add(answer);
            _context.SaveChanges();
            return answer;
        }

    }
}
