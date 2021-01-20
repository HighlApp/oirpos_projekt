namespace WebApi.Entities
{
    public class Token
    {
        public int Id { get; set; }
        public string Uuid { get; set; }
        public bool IsValid { get; set; }
        public Voting Voting { get; set; }
    }
}