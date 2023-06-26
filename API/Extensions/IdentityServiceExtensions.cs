using System.Text;
using API.Services;
using Domain;
using Infrastructure.Security;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using Storage;

namespace API.Extensions
{
    public static class IdentityServiceExtensions
    {
        public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                opt.User.RequireUniqueEmail = true; //checks if email is unique

            })
            .AddEntityFrameworkStores<DataContext>(); //allows to query users in Entity Framework Store or database

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opt =>
            {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true, //validates a token for signature
                    IssuerSigningKey = key,
                    ValidateIssuer = false,
                    ValidateAudience = false,
                };
            });
            //Only host can edit and delete an activity
            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost", policy => {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });
            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>(); //part of policy for host to edit and delete and activity
            services.AddScoped<TokenService>(); //This service is going to be scoped to the http request it self
            //when http request comes in we go to account controller and request a token because we attempting to login and a tokenService is a new
            //instance where tokenService will be created, and when http request is finished it will dispose of token Service.
            //There are other methods like AddTransient<> and AddSingleton<> (creates service when application starts, and service is kept alive until app shuts down), but they typically considering to shorts or too long to keep a service alive..

            return services;
        }
    }
}