using System;
using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Entities;
using WebApi.Helpers;
using WebApi.Models.Users;
using WebApi.Services;

namespace WebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class VotingController : ControllerBase
    {
        private IVotingService _votingService;
        private IQuestionService _questionService;
        private ITokenService _tokenService;
        private IAnswerService _answerService;
        private IMapper _mapper;
        private readonly AppSettings _appSettings;

        public VotingController(
            IVotingService votingService,
            ITokenService tokenService,
            IAnswerService answerService,
            IQuestionService questionService,
            IMapper mapper,
            IOptions<AppSettings> appSettings)
        {
            _votingService = votingService;
            _tokenService = tokenService;
            _answerService = answerService;
            _questionService = questionService;
            _mapper = mapper;
            _appSettings = appSettings.Value;
        }

        [HttpPost("create")]
        public IActionResult Register([FromBody] VotingModel model)
        {
            var voting = _mapper.Map<Voting>(model);

            try
            {
                _votingService.Create(voting);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }
        
        [AllowAnonymous]
        [HttpPost("answer/{uuid}/{questionId}")]
        public IActionResult SaveAnswer([FromBody] string answerStr, string uuid, int questionId)
        {
            var token = _tokenService.GetByUuid(uuid);
            var question = _questionService.GetById(questionId);
            
            Answer answer = new Answer();
            answer.Question = question;
            answer.Token = token;
            answer.Value = answerStr;

            try
            {
                _answerService.Create(answer);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }
        
        [HttpGet]
        public IActionResult GetAll()
        {
            var votings = _votingService.GetAll();
            var vot = _mapper.Map<IList<VotingModelWithId>>(votings);
            return Ok(vot);
        }        
        
        [HttpGet("{vId}/question/{qId}/activate")]
        public IActionResult ActivateQuestion(int vId, int qId)
        {
            try
            {
                _questionService.ActivateQuestion(vId, qId);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message});
            }
        }        
        
        [AllowAnonymous]
        [HttpGet("{token}")]
        public IActionResult GetByToken(string token)
        {
            try
            {
                var voting = _votingService.GetByToken(token);
                Question question = _questionService.GetByToken(token);

                if (question == null)
                {
                    bool canShowSummary = _questionService.CheckIfAllQuestionsAnsweredForVoting(token);
                    if (canShowSummary)
                    {
                        var votingResult = _votingService.GetWithRelationByToken(token);
                        var modelVoting = _mapper.Map<VotingModel>(votingResult);
                        return Ok(modelVoting);
                    }
                    throw new AppException("Brak pytań do odpowiedzi!");                
                }
                
                
                var model = new AttemptModel();
                model.Title = voting.Name;
                model.Question = _mapper.Map<QuestionModelWithId>(question);
                return Ok(model);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }        
        
        [HttpGet("result/{token}")]
        public IActionResult GetResult(string token)
        {
            try
            {
                var voting = _votingService.GetByToken(token);
                var model = _mapper.Map<VotingModel>(voting);
                return Ok(model);
            }
            catch (Exception ex) 
            {
                return BadRequest(new { message = ex.Message });
            }
        }    
        
        [HttpGet("link/{id}")]
        public IActionResult GenerateLinkId(int id)
        {
            var voting = _votingService.GetById(id);
            Token token = new Token();
            token.Voting = voting;
            token.IsValid = true;
            token.Uuid = Guid.NewGuid().ToString();

            try
            {
                _questionService.CheckIdVotingOpened(id);
            }
            catch (AppException ex)
            {
                return BadRequest(new {message = ex.Message});
            }
            
            token = _tokenService.Create(token);
            var model = _mapper.Map<TokenModel>(token);
            return Ok(model);
        }
    }
}