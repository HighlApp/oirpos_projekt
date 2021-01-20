namespace WebApi.Entities
{
    public class Answer
    {
        public int Id { get; set; }
        public string Value { get; set; }
        public Token Token { get; set; }
        public Question Question { get; set; }
    }
}