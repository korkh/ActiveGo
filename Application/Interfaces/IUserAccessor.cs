namespace Application.Interfaces //Following interface will help us to communicate Infrastructure with Application's services
{
    public interface IUserAccessor
    {
        string GetUserName();
    }
}