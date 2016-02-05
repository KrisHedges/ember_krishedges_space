defmodule KrishedgesSpace.PostController do
  use KrishedgesSpace.Web, :controller
  use Guardian.Phoenix.Controller

  alias KrishedgesSpace.Post
  require IEx
  plug :scrub_params, "post" when action in [:create, :update]

  def index(conn, _params, current_user, claims) do
    posts = Repo.all(Post)
    render(conn, "index.json", posts: posts)
  end

  def create(conn, %{"post" => post_params}, current_user, claims) do
    edit = %KrishedgesSpace.Edit{user_id: current_user.id}
    changeset = Post.changeset(%Post{}, post_params) |> Ecto.Changeset.put_embed(:edits, [edit])

    case Repo.insert(changeset) do
      {:ok, post} ->
        conn
        |> put_status(:created)
        |> render("show.json", post: post)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(KrishedgesSpace.ErrorView, "error.json", changeset: changeset)
    end
  end

  def show(conn, %{"id" => id}, current_user, claims) do
    post = Repo.get!(Post, id)
    render(conn, "show.json", post: post)
  end

  def update(conn, %{"id" => id, "post" => post_params}, current_user, claims) do
    post = Repo.get!(Post, id)
    edit = %KrishedgesSpace.Edit{user_id: current_user.id}
    changeset = Post.changeset(post, post_params) |> Ecto.Changeset.put_embed(:edits, post.edits ++ [edit])

    case Repo.update(changeset) do
      {:ok, post} ->
        render(conn, "show.json", post: post)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(KrishedgesSpace.ErrorView, "error.json", changeset: changeset)
    end
  end

  def delete(conn, %{"id" => id}, current_user, claims) do
    post = Repo.get!(Post, id)

    # Here we use delete! (with a bang) because we expect
    # it to always work (and if it does not, it will raise).
    Repo.delete!(post)

    send_resp(conn, :no_content, "")
  end
end
