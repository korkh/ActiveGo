using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace API.Services
{
    public class TokenService
    {
        public readonly IConfiguration _config;
        public TokenService(IConfiguration config)
        {
            _config = config;
        }
        public string CreateToken(AppUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
            };

            //Token preparation
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"])); //symmetric is using same key for encryption and for the decription (should be not less than 12 chars)
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature); //credentials HmacSha512Signature

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = credentials
            };

            //Token handler
            var tokenHandler = new JwtSecurityTokenHandler();

            //Creating token
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}