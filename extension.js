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
    console.log(
        "Woo Hoo!!! You just found Bryanna' favorite pet and activated the cheater mode!!"
    );

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand(
        "extension.thispetiscodyproof",
        function() {
            const HomeControllerContent = `
				using System;
				using System.Collections.Generic;
				using System.Diagnostics;
				using System.Linq;
				using System.Threading.Tasks;
				using Microsoft.AspNetCore.Mvc;
				using BrightIdeas.Models;
				using Microsoft.EntityFrameworkCore;
				using Microsoft.AspNetCore.Identity;
				using Microsoft.AspNetCore.Http;

				namespace BrightIdeas.Controllers
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
				using BrightIdeas.Models;
				using Microsoft.EntityFrameworkCore;

				namespace BrightIdeas
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

            const folderPath = vscode.workspace.workspaceFolders[0].uri
                .toString()
                .split(":")[1];

            fs.writeFile(
                path.join(folderPath, "HomeController.cs"),
                HomeControllerContent,
                err => {
                    if (err) {
                        console.error(err);
                        vscode.window.showErrorMessage(
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
                        vscode.window.showErrorMessage(
                            "Failed to create the Startup.cs file"
                        );
                    }
                    vscode.window.showInformationMessage(
                        "Sucessfully created Startup.cs file"
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
