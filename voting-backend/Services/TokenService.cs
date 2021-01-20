using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;
using WebApi.Helpers;

namespace WebApi.Services
{
    public interface ITokenService
    {
        Token Create(Token token);
        public Token GetByUuid(string uuid);
    }
    
    public class TokenService : ITokenService
    {
     
        private DataContext _context;
        
        public TokenService(DataContext context)
        {
            _context = context;
        }
        
        public Token Create(Token token)
        {
            _context.Tokens.Add(token);
            _context.SaveChanges();
            return token;
        }
        
        
        public Token GetByUuid(string uuid)
        {
            Token token = _context.Tokens
                .Where(t => t.IsValid)
                .FirstOrDefault(r => r.Uuid.Equals(uuid));
            
            
            if (token == null)
            {
                throw new AppException("Nie znaleziono tokena!");
            } 

            return token;
        }
    }
}