// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Woo Hoo!!! You just became a CHEATER!!");

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "extension.bryannasPet",
        function() {
            const HomeControllerContent = `
				using System;
				using System.Collections.Generic;
				using System.Diagnostics;
				using System.Linq;
				using System.Threading.Tasks;
				using Microsoft.AspNetCore.Mvc;
				//****Change YourNamespace!!!!****
				using YourNamespace.Models;
				using Microsoft.EntityFrameworkCore;
				using Microsoft.AspNetCore.Identity;
				using Microsoft.AspNetCore.Http;

				//****Change YourNamespace!!!!****
				namespace YourNamespace.Controllers
				{
					public class HomeController : Controller
					{
						private MyContext dbContext;
						public HomeController(MyContext context)
						{
							dbContext = context;
						}

						public IActionResult Index()
						{
							int? IfLoggedIn = HttpContext.Session.GetInt32("IsLoggedIn");
							if (IfLoggedIn != 1)
							{
								HttpContext.Session.SetInt32("IsLoggedIn", 0);
								return View();
							}
							else
							{
								return RedirectToAction("Dashboard");
							}
						}


						[HttpPost("register")]
						public IActionResult Register(User newUser)
						{

							if (ModelState.IsValid)
							{
								if (dbContext.Users.Any(u=>u.Email == newUser.Email))
								{
									ModelState.AddModelError("newUser.Email", "This Email has been used!");
									return View("Index");
								}
								else
								{
									PasswordHasher<User> Hasher = new PasswordHasher<User>();
									newUser.Password = Hasher.HashPassword(newUser, newUser.Password);
									dbContext.Add(newUser);
									dbContext.SaveChanges();
									HttpContext.Session.SetInt32("IsLoggedIn", 1);
									return RedirectToAction("Dashboard");
								}
							}
							else
							{
								return View("Index");
							}
						}

						[HttpPost("login")]
						public IActionResult Login(LoginUser returnUser)
						{
							if (ModelState.IsValid)
							{
								User userInDb = dbContext.Users.FirstOrDefault(u=>u.Email == returnUser.Email);
								if (userInDb == null)
								{
									ModelState.AddModelError("returnUser.Email", "Invalid Email/Password");
									return View("Index");
								}
								else
								{
									PasswordHasher<LoginUser> hasher = new PasswordHasher<LoginUser>();
									var result = hasher.VerifyHashedPassword(returnUser, userInDb.Password, returnUser.Password);
									if (result == 0)
									{
										ModelState.AddModelError("returnUser.Password", "Invalid Email/Password");
										return View("Index");
									}
									else
									{
										HttpContext.Session.SetInt32("UserId", userInDb.UserId);
										HttpContext.Session.SetInt32("IsLoggedIn", 1);
										return RedirectToAction("Dashboard");
									}
								}
							}
							else
							{
								return View("Index");
							}
						}

						[HttpGet]
						[Route("logout")]
						public IActionResult Logout()
						{
							HttpContext.Session.Clear();
							return RedirectToAction("Index");
						}

						[HttpGet]
						[Route("dashboard")]
						public IActionResult Dashboard()
						{
							//The rest is gonna be your job, dude!
						}
					}
				}
				`;
            const StartupContent = `
				using System;
				using System.Collections.Generic;
				using System.Linq;
				using System.Threading.Tasks;
				using Microsoft.AspNetCore.Builder;
				using Microsoft.AspNetCore.Hosting;
				using Microsoft.AspNetCore.Http;
				using Microsoft.AspNetCore.Mvc;
				using Microsoft.Extensions.Configuration;
				using Microsoft.Extensions.DependencyInjection;
				//****Change YourNamespace!!!!****
				using YourNamespace.Models;
				using Microsoft.EntityFrameworkCore;
				
				//****Change YourNamespace!!!!****
				namespace YourNamespace
				{
					public class Startup
					{
						public Startup(IConfiguration configuration)
						{
							Configuration = configuration;
						}
				
						public IConfiguration Configuration { get; }
				
						// This method gets called by the runtime. Use this method to add services to the container.
						public void ConfigureServices(IServiceCollection services)
						{
							services.AddDbContext<MyContext>(options=>options.UseMySql(Configuration["DBInfo:ConnectionString"]));
							services.AddSession();
							services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
						}
				
						// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
						public void Configure(IApplicationBuilder app, IHostingEnvironment env)
						{
							if (env.IsDevelopment())
							{
								app.UseDeveloperExceptionPage();
							}
							else
							{
								app.UseExceptionHandler("/Home/Error");
							}
				
							app.UseSession();
							app.UseStaticFiles();
				
							app.UseMvc(routes =>
							{
								routes.MapRoute(
									name: "default",
									template: "{controller=Home}/{action=Index}/{id?}");
							});
						}
					}
				}
				
				`;
            const AppSettingContent = `
				{
					"DBInfo":
					{
						"Name": "MySQLconnect",
						"ConnectionString": "server=localhost;userid=root;password=rootroot;port=3306;database=YourDBName;SslMode=None"
					}
				}
				`;
            const IndexContent = `
				@{
					ViewData["Title"] = "Home";
				}
				
				@model LoginReg
				<div class="row banner text-center">
					<div class="col-9">
						<h1>Welcome to The Bright Ideas Board!</h1>
					</div>
				</div>
				
				<div class="row">
					<div class="col-6">
						<h3>Register</h3>
						<form action="/register" method="POST" class="SignupForm">
							<div class="form-group">
								<label asp-for="NewUser.Name"></label>
								<input type="text" class="form-control" asp-for="NewUser.Name" id="Name" placeholder="Name">
								<span asp-validation-for="NewUser.Name" class="validationMsg"></span>
							</div>
							<div class="form-group">
								<label asp-for="NewUser.Alias"></label>
								<input type="text" class="form-control" asp-for="NewUser.Alias" id="Alias" placeholder="Alias">
								<span asp-validation-for="NewUser.Alias" class="validationMsg"></span>
							</div>
							<div class="form-group">
								<label asp-for="NewUser.Email"></label>
								<input type="text" class="form-control" asp-for="NewUser.Email" id="Email" aria-describedby="emailHelp" placeholder="Email">
								<span asp-validation-for="NewUser.Email" class="validationMsg"></span>
							</div>
							<div class="form-group">
								<label asp-for="NewUser.Password"></label>
								<input type="password" asp-for="NewUser.Password" class="form-control" id="Password" placeholder="Password">
								<span asp-validation-for="NewUser.Password" class="validationMsg"></span>
							</div>
							<div class="form-group">
								<label asp-for="NewUser.ConfirmPw"></label>
								<input type="password" asp-for="NewUser.ConfirmPw" class="form-control" id="ConfirmPw" placeholder="Type Password Again">
								<span asp-validation-for="NewUser.ConfirmPw" class="validationMsg"></span>
							</div>
							<button type="submit" class="btn btn-primary">Sign up Now</button>
						</form>
					</div>
					<div class="col-6">
						<h3>Login</h3>
						<form action="/login" method="POST" class="LoginForm">
							<div class="form-group">
								<label asp-for="ReturnUser.Email"></label>
								<input type="email" class="form-control" asp-for="ReturnUser.Email" id="Email" aria-describedby="emailHelp" placeholder="Email">
							</div>
							<div class="form-group">
								<label asp-for="ReturnUser.Password"></label>
								<input type="password" asp-for="ReturnUser.Password" class="form-control" id="Password" placeholder="Password">
								<span asp-validation-for="ReturnUser.Password" class="validationMsg"></span>
								<span asp-validation-for="ReturnUser.Email" class="validationMsg"></span>
							</div>
							<button type="submit" class="btn btn-primary">Login Now</button>
						</form>
					</div>
				</div>
				`;
            const MyContextContent = `
			using Microsoft.EntityFrameworkCore;
			using System.Linq;
			using Microsoft.AspNetCore.Mvc;
			
			//****Change YourNamespace!!!!****
			namespace YourNamespace.Models
			{
				public class MyContext : DbContext
				{
					public MyContext(DbContextOptions options) : base(options) {}
			
					public DbSet<User> Users { get; set; }
				}
			}
			`;
            const UserModelContent = `
			using System.ComponentModel.DataAnnotations;
			using System;
			using System.Collections.Generic;
			using System.ComponentModel.DataAnnotations.Schema;
			
			//****Change YourNamespace!!!!****
			namespace YourNamespace.Models
			{
				public class User
				{
					[Key]
					public int UserId { get; set; }
			
					[Required]
					[RegularExpression(@"^[a-zA-Z ]+$", ErrorMessage = "Use letters only please")]
					public string Name { get; set; }
			
					[Required]
					[RegularExpression(@"^[a-zA-Z0-9]+$", ErrorMessage = "Use letters and numbers only please")]
					public string Alias { get; set; }
			
					[Required]
					[EmailAddress(ErrorMessage = "Invalid Email Address")]
					public string Email { get; set; }
			
					[Required]
					[DataType(DataType.Password)]
					[MinLength(8, ErrorMessage = "Password must be 8 charactors or longer")]
					public string Password { get; set; }
			
					[Required]
					public DateTime CreatedAt { get; set; } = DateTime.Now;
					[Required]
					public DateTime UpdatedAt { get; set; } = DateTime.Now;
			
					[NotMapped]
					[Compare("Password")]
					[DataType(DataType.Password)]
					[Display(Name="Confirm Password")]
					public string ConfirmPw { get; set; }
				}
			}
				`;
            const OnePageLoginRegModelContent = `
			using System;
			using System.ComponentModel.DataAnnotations;
			using System.ComponentModel.DataAnnotations.Schema;
			
			//****Change YourNamespace!!!!****
			namespace YourNamespace.Models
			{
				public class LoginReg
				{
					public User NewUser { get; set; }
					public LoginUser ReturnUser { get; set; }
				}
			}
			`;
            const LoginValidationModelContent = `
			using System.ComponentModel.DataAnnotations;
			using System;
			using System.ComponentModel.DataAnnotations.Schema;
			
			//****Change YourNamespace!!!!****
			namespace YourNamespace.Models
			{
				public class LoginUser
				{
					public string Email { get; set; }
					public string Password { get; set; }
			
				}
			
			}
				`;
            const folderPath = vscode.workspace.workspaceFolders[0].uri
                .toString()
                .split(":")[1];

            fs.writeFile(
                path.join(folderPath, "HomeController.cs"),
                HomeControllerContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the HomeController.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created HomeController.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "Startup.cs"),
                StartupContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the Startup.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created Startup.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "appsettings.json"),
                AppSettingContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the appsettings.json file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created appsettings.json file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "Index.cshtml"),
                IndexContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the Index.cshtml file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created Index.cshtml file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "MyContext.cs"),
                MyContextContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the MyContext.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created MyContext.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "MyContext.cs"),
                MyContextContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the MyContext.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created MyContext.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "User.cs"),
                UserModelContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the User.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created User.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "LoginReg.cs"),
                OnePageLoginRegModelContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the LoginReg.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created LoginReg.cs file"
                    );
                }
            );
            fs.writeFile(
                path.join(folderPath, "LoginUser.cs"),
                LoginValidationModelContent,
                err => {
                    if (err) {
                        console.error(err);
                        return vscode.window.showErrorMessage(
                            "Failed to create the LoginUser.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created LoginUser.cs file"
                    );
                }
            );
        }
    );
    context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
