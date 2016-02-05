defmodule KrishedgesSpace.UserController do
  use KrishedgesSpace.Web, :controller
  use Guardian.Phoenix.Controller
  alias KrishedgesSpace.User
  require IEx

  plug :scrub_params, "user" when action in [:create, :update]
  plug Guardian.Plug.EnsureAuthenticated, %{ handler: { KrishedgesSpace.SessionController, :unauthenticated } } # when not action in [:index, :create]

  def index(conn, _params, current_user, claims) do
    users = Repo.all(User)
    render(conn, "index.json", users: users)
  end

  def show(conn, %{"id" => id}, current_user, claims) do
    user = Repo.get!(User, id)
    render(conn, "show.json", user: user)
  end

  def create(conn, %{"user" => user_params}, current_user, claims) do
    changeset = User.changeset(%User{}, user_params)
    case Repo.insert(changeset) do
      {:ok, user} ->
        conn
        |> put_status(:created)
        |> render("show.json", user: user)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(KrishedgesSpace.ErrorView, "errors.json", changeset: changeset)
    end
  end

  def update(conn, %{"id" => id, "user" => user_params}, current_user, claims) do
    user = Repo.get!(User, id)

    if user_params["password"] != nil do
      changeset = User.changeset(user, user_params)
    else
      changeset = User.no_pass_changeset(user, user_params)
    end

    if current_user != user and user_params["password"] != nil do
      conn
      |> put_status(401)
      |> render(KrishedgesSpace.ErrorView, "error.json", message: "You can not change some elses password.")
    else
      case Repo.update(changeset) do
        {:ok, user} ->
          render(conn, "show.json", user: user)
        {:error, changeset} ->
          conn
          |> put_status(422)
          |> render(KrishedgesSpace.ErrorView, "errors.json", changeset: changeset)
      end
    end
  end

  def delete(conn, %{"id" => id}, current_user, claims) do
    user = Repo.get!(User, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(user)
    send_resp(conn, :no_content, "")
  end


end
