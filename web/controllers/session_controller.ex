defmodule KrishedgesSpace.SessionController do
  use KrishedgesSpace.Web, :controller

  def create(conn, %{"user" => %{"password" => pass, "username" => username}}) do
    user = Repo.get_by(KrishedgesSpace.User, username: username)
    if user do
      case KrishedgesSpace.Auth.login_by_username_and_pass(conn, user, pass) do
        {:ok, jwt, _claims} ->
          conn
          |> put_status(:ok)
          |> render(KrishedgesSpace.UserView, "show.json", user: user, token: jwt)
        {:error, reason, conn} ->
          conn
          |> put_status(reason)
          |> render(KrishedgesSpace.ErrorView, "error.json", message: "Sorry, that appears to be an invalid username/password combination.")
      end
    else
      conn
      |> put_status(422)
      |> render(KrishedgesSpace.ErrorView, "error.json", message: "Sorry but, We couldn't find a user with that username.")
    end
  end

  def create(conn, _) do
    conn
    |> put_status(400)
    |> render(KrishedgesSpace.ErrorView, "error.json", message: "Sorry but, we didn't get that. Please try again")
  end


  def unauthenticated(conn, _reason, _ ) do
    conn
    |> put_status(:unauthorized)
    |> render(KrishedgesSpace.ErrorView, "error.json", message: "Sorry, you must be logged in to perform this action.")
  end

end

