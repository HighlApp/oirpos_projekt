using System;
using AutoMapper;
using WebApi.Entities;
using WebApi.Models.Users;

namespace WebApi.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<User, UserModel>();
            CreateMap<VotingModel, Voting>();
            CreateMap<Voting, VotingModel>();
            CreateMap<QuestionModel, Question>();
            CreateMap<Question, QuestionModel>();
            CreateMap<Question, QuestionModelWithId>();
            CreateMap<Voting, VotingModelWithId>();
            CreateMap<Token, TokenModel>();
            CreateMap<Answer, AnswerModel>();
        }
    }
}