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

  scope "/", KrishedgesSpace do
    pipe_through :browser # Use the default browser stack
    get "/", PageController, :index
  end

  scope "/api", KrishedgesSpace do
    pipe_through :api
    resources "/users", UserController, except: [:new, :edit]
    resources "/sessions", SessionController, only: [:create]
  end
end
