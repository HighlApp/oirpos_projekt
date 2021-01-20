using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using WebApi.Entities;
using WebApi.Helpers;
using System.Linq;

namespace WebApi.Services
{
    public interface IVotingService
    {
        Voting Create(Voting voting);
        IEnumerable<Voting> GetAll();
        Voting GetById(int id);
        Voting GetByToken(string token);
        public Voting GetWithRelationByToken(string token);
        
    }

    public class VotingService : IVotingService
    {
        private DataContext _context;

        public VotingService(DataContext context)
        {
            _context = context;
        }

        public Voting Create(Voting voting)
        {
            if (_context.Votings.Any(x => x.Name == voting.Name))
                throw new AppException("Ankieta o nazwie \"" + voting.Name + "\" jest już w systemie!");

            _context.Votings.Add(voting);
            _context.SaveChanges();

            return voting;
        }
        
        public IEnumerable<Voting> GetAll()
        {
            var votings = _context.Votings
                .Include(v => v.Questions)
                .ThenInclude(q => q.Voting)
                .ToList();
            
            foreach (var voting in votings)
            {
                foreach (var votingQuestion in voting.Questions)
                {
                    var answers = _context.Answers
                        .Where(a => a.Question.Equals(votingQuestion)).ToList();
                    votingQuestion.Answers = answers;
                }
            }
            return votings;
        }
        
        public Voting GetWithRelationByToken(string token)
        {
            var voting = _context.Tokens
                .Include(t => t.Voting)
                .ThenInclude(v => v.Questions)
                .ThenInclude(q => q.Voting)
                .Where(t => t.Uuid.Equals(token))
                .FirstOrDefault().Voting;
            
            foreach (var votingQuestion in voting.Questions)
            {
                var answers = _context.Answers
                    .Where(a => a.Question.Equals(votingQuestion)).ToList();
                votingQuestion.Answers = answers;
            }
            return voting;
        }
        
        public Voting GetById(int id)
        {
            return _context.Votings
                .Include(v => v.Questions)
                .ThenInclude(q => q.Voting).FirstOrDefault(r => r.Id.Equals(id));
        }
        
        public Voting GetByToken(string token)
        {
            Voting voting = _context.Tokens
                .Include(t => t.Voting)
                .ThenInclude(v => v.Questions)
                .ThenInclude(q => q.Voting)
                .Where(t => t.IsValid)
                .FirstOrDefault(r => r.Uuid.Equals(token))
                ?.Voting;
            
            if (voting == null)
            {
                throw new AppException("Nie znaleziono głosowania/ankiety!");
            } 

            return voting;
        }
    }
}