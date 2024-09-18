using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;



 [ApiController]
 [Route("api/[controller]")]
 public class UsersControllers : ControllerBase
 {
     [HttpGet("all")]
     [ProducesResponseType(StatusCodes.Status204NoContent)]
     [ProducesResponseType(StatusCodes.Status400BadRequest)]
     [ProducesResponseType(StatusCodes.Status200OK)]
     public ActionResult<List<Users>> GetAll()
     {
         try
         {
             List<Users> users = DBServices.GetUsers();
             return Ok(users);
         }
         catch (Exception e)
         {
             return BadRequest(e.Message);
         }
     }

    [HttpGet("{id:int:min(0)}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Users))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetUserById(int id)
    {
        try
        {
            Users user = DBServices.GetUserById(id);
            if (user == null)
            {
                return NotFound(new { message = $"User with id = {id} was not found." });
            }
            return Ok(user);
        }
        catch (Exception e)
        {
            return StatusCode(StatusCodes.Status400BadRequest, e.Message);
        }
    }


    [HttpPost("create")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult CreateUser([FromBody] Users newUser)
    {
        // AvatarUrl est null par défaut si non fourni
        bool result = DBServices.CreateUser(newUser);

        if (result)
        {
            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }
        else
        {
            return BadRequest(new { message = "Failed to create user." });
        }
    }


    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult UpdateUser(int id, [FromBody] Users updatedUser)
    {
        var user = DBServices.GetUserById(id);
        if (user == null)
        {
            return NotFound(new { message = "User not found." });
        }

        // Mettre à jour l'avatar
        user.AvatarUrl = updatedUser.AvatarUrl;
        bool result = DBServices.UpdateUser(id, user);

        if (result)
        {
            return Ok(new { message = "Avatar updated successfully." });
        }
        else
        {
            return BadRequest(new { message = "Failed to update avatar." });
        }
    }



    [HttpDelete("{id}")]
     [ProducesResponseType(StatusCodes.Status204NoContent)]
     [ProducesResponseType(StatusCodes.Status400BadRequest)]
     [ProducesResponseType(StatusCodes.Status404NotFound)]
     public IActionResult DeleteUser(int id)
     {
         bool result = DBServices.DeleteUserById(id);
         if (result)
         {
             return Ok(new { message = "User deleted successfully." });
         }
         else
         {
             return NotFound(new { message = "User not found." });
         }
     }

     [HttpPost("login")]
     [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Users))]
     [ProducesResponseType(StatusCodes.Status404NotFound)]
     [ProducesResponseType(StatusCodes.Status400BadRequest)]
     public IActionResult Login([FromBody] LoginData ld)
     {
         try
         {
             if (ld == null || string.IsNullOrEmpty(ld.UserName) || string.IsNullOrEmpty(ld.Password))
             {
                 return BadRequest("Invalid login request.");
             }

             Users usr = DBServices.Login(ld.UserName, ld.Password);
             if (usr != null)
             {
                 return Ok(usr);
             }
             else
             {
                 return Unauthorized("Invalid username or password.");
             }
         }
         catch (Exception e)
         {
             return BadRequest(e.Message);
         }
     }

 }