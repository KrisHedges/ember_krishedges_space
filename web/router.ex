defmodule KrishedgesSpace.Router do
  use KrishedgesSpace.Web, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_flash
    plug :protect_from_forgery
    plug :put_secure_browser_headers
  end

  pipeline :api do
    plug :accepts, ["json"]
    plug Guardian.Plug.VerifyHeader # looks in the session for the token
    plug Guardian.Plug.LoadResource
  end

  scope "/api", KrishedgesSpace do
    pipe_through :api
    resources "/users", UserController, except: [:new, :edit]
    resources "/roles", RoleController, except: [:new, :edit]
    resources "/sessions", SessionController, only: [:create]
    resources "/posts", PostController, except: [:new, :edit]
    resources "/categories", CategoryController, except: [:new, :edit]
  end

  scope "/", KrishedgesSpace do
    pipe_through :browser # Use the default browser stack
    get "/", StaticController, :public
    get "/admin", StaticController, :admin
    get "/admin/*path", StaticController, :admin
    get "/*path", StaticController, :public
  end


end
