using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Services
{
    public interface IQuestionService
    {
        public Question GetById(int id);
        public Question GetByToken(string uuid);
        public void ActivateQuestion(int vId, int qId);
        // public void DeactivateQuestionIfLastAnswer(int questionId);
        public void CheckIdVotingOpened(int votingId);
        public bool CheckIfAllQuestionsAnsweredForVoting(string token);
    }

    public class QuestionService : IQuestionService
    {
        private DataContext _context;

        public QuestionService(DataContext context)
        {
            _context = context;
        }

        public Question GetById(int id)
        {
            return _context.Questions
                .FirstOrDefault(r => r.Id.Equals(id));
        }

        public Question GetByToken(string uuid)
        {
            IQueryable<Question> questions = _context.Questions.FromSqlRaw(
                "SELECT q.* " +
                "FROM \"Votings\" v " +
                "JOIN \"Tokens\" t on v.\"Id\" = t.\"VotingId\" " +
                "JOIN \"Questions\" q on v.\"Id\" = q.\"VotingId\" " +
                "LEFT JOIN \"Answers\" a on q.\"Id\" = a.\"QuestionId\" and a.\"TokenId\" = t.\"Id\" " +
                "WHERE t.\"Uuid\" = {0} " +
                "AND q.\"Active\" = true " +
                "AND a.\"Id\" IS NULL " +
                "ORDER BY q.\"Id\" asc " +
                "LIMIT 1", uuid);
            var question = questions.FirstOrDefault();

            return question;
        }

        // public void DeactivateQuestionIfLastAnswer(int questionId)
        // {
        //     List<Question> questions = _context.Questions.FromSqlRaw(
        //         "SELECT q.* " +
        //         "FROM \"Tokens\" t " +
        //         "JOIN \"Votings\" v on t.\"VotingId\" = v.\"Id\" " +
        //         "JOIN \"Questions\" q on q.\"VotingId\" = v.\"Id\" " +
        //         "LEFT JOIN \"Answers\" a on a.\"TokenId\" = t.\"Id\" and a.\"QuestionId\" = q.\"Id\" " +
        //         "WHERE q.\"Id\" = {0} " + 
        //         "AND a.\"Id\" IS NULL", questionId
        //     ).ToList();
        //
        //     if (questions.Count == 0)
        //     {
        //         _context.Questions.Where(q => q.Id == questionId)
        //             .ToList()
        //             .ForEach(q => q.Active = false);
        //         _context.SaveChanges();
        //     }
        // }

        public bool CheckIfAllQuestionsAnsweredForVoting(string token)
        {
            var voting = _context.Tokens
                .Include(t => t.Voting)
                .Where(t => t.Uuid.Equals(token)).FirstOrDefault().Voting;
            
            List<Question> questions = _context.Questions.FromSqlRaw(
                "select q.* " +
                "from \"Votings\" v " +
                "join \"Tokens\" t on t.\"VotingId\" = v.\"Id\"  " +
                "join \"Questions\" q on q.\"VotingId\" = v.\"Id\"  " +
                "LEFT JOIN \"Answers\" a on a.\"TokenId\" = t.\"Id\" and a.\"QuestionId\" = q.\"Id\"  " +
                "where v.\"Id\" = {0} " +
                "and a.\"Id\" is null ", voting.Id
            ).ToList();

            if (questions.Count == 0)
            {
                return true;
            }

            return false;
        }


        public void CheckIdVotingOpened(int votingId)
        {
            List<Question> activeQuestions = _context.Questions.FromSqlRaw(
                "SELECT q.* " +
                "FROM \"Votings\" v " +
                "JOIN \"Questions\" q on q.\"VotingId\" = v.\"Id\" " +
                "WHERE v.\"Id\" = {0} " +
                "AND q.\"Active\" = true", votingId
            ).ToList();

            if (activeQuestions.Count != 0)
            {
                throw new AppException("Nie można utworzyć linka! Głosowanie zostało już otwarte!");
            }
        }

        public void ActivateQuestion(int vId, int qId)
        {
            List<Question> questions = _context.Questions.FromSqlRaw(
                "SELECT q.* " +
                "FROM \"Tokens\" t " +
                "JOIN \"Votings\" v on t.\"VotingId\" = v.\"Id\" " +
                "JOIN \"Questions\" q on q.\"VotingId\" = v.\"Id\" " +
                "LEFT JOIN \"Answers\" a on a.\"TokenId\" = t.\"Id\" and a.\"QuestionId\" = q.\"Id\" " +
                "WHERE (q.\"Id\" = {0} AND a.\"Id\" IS NULL)", qId - 1
            ).ToList();

            if (questions.Count != 0)
            {
                Question firstQuestion = _context.Questions.FromSqlRaw(
                    "SELECT q1.* " +
                    "FROM \"Votings\" v1 " +
                    "JOIN \"Questions\" q1 on q1.\"VotingId\" = v1.\"Id\" " +
                    "WHERE v1.\"Id\" = {0} " +
                    "ORDER BY q1.\"Id\" asc " +
                    "LIMIT 1 ", vId
                ).FirstOrDefault();

                if (firstQuestion == null || firstQuestion.Id != qId)
                {
                    throw new AppException(
                        "Nie można aktywować pytania! Jeszcze nie wszyscy odpowiedzieli na poprzednie pytanie!");
                }
            }

            _context.Questions
                .Where(q => q.Id == qId)
                .ToList()
                .ForEach(q => q.Active = true);


            _context.SaveChanges();
        }
    }
}