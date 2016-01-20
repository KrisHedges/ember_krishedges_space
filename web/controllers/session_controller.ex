defmodule KrishedgesSpace.SessionController do
  use KrishedgesSpace.Web, :controller

  def create(conn, %{"user" => %{"password" => pass, "username" => username}}) do
    user = Repo.get_by(KrishedgesSpace.User, username: username)
    case KrishedgesSpace.Auth.login_by_username_and_pass(conn, user, pass) do
      {:ok, jwt, full_claims} ->
        conn
        |> put_status(:ok)
        |> render(KrishedgesSpace.UserView, "show.json", user: user, token: jwt)
      {:error, reason, conn} ->
        conn
        |> put_status(reason)
        |> render(KrishedgesSpace.UserView, "error.json", message: "Sorry, that appears to be an invalid username/password combination")
    end
  end

  def unauthenticated(conn, _params) do
    conn
    |> put_status(:unauthorized)
    |> render(KrishedgesSpace.UserView, "error.json", message: "Sorry, you must be logged in to perform this action.")
  end

end

