defmodule KrishedgesSpace.UploadController do
  use KrishedgesSpace.Web, :controller
  use Guardian.Phoenix.Controller
  require IEx

  plug :scrub_params, "file" when action in [:create]
  plug :scrub_params, "path" when action in [:create]

  plug Guardian.Plug.EnsureAuthenticated, %{ handler: { KrishedgesSpace.SessionController, :unauthenticated } }

  def index(conn, _params, _current_user, _claims) do
    path = "priv/static/public/uploads/"
    files = Path.wildcard("#{path}**/*")
    #Build our object for the json
    |> Enum.map(fn(filepath) ->
      file_name = Regex.replace(~r/.*\//, filepath, "")
      file_relative_path = Regex.replace(~r/priv\/static\/public\/uploads\//, filepath, "")
      %{ :filename => file_name, :path => "/#{file_relative_path}", :type => elem(File.stat(filepath),1).type }
    end)
    render(conn, KrishedgesSpace.UploadView, "index.json", uploads: files)
  end

  def create(conn, %{"file" => file_params, "path" => path_params}, _current_user, _claims) do
    path = if path_params, do: path_params, else: ''
    if Map.get(file_params, "type") === "directory" do
      case File.mkdir_p("priv/static/public/uploads/#{path}/") do
        :ok ->
          conn
          |> put_status(:created)
          |> send_resp(:no_content, "")
        {:error, reason} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(KrishedgesSpace.ErrorView, "error.json", message: reason)
      end
    else
      case File.cp(file_params.path, "priv/static/public/#{path}/#{URI.decode(file_params.filename)}") do
        :ok ->
          conn
          |> put_status(:created)
          |> send_resp(:no_content, "")
        {:error, reason} ->
          conn
          |> put_status(:unprocessable_entity)
          |> render(KrishedgesSpace.ErrorView, "error.json", message: reason)
      end
    end
  end

  def update(conn, %{"file" => file_params}, current_user, claims) do
    IEx.pry
  end

  def delete(conn, params, _current_user, _claims) do
    path = params["path"]
    file_path = "priv/static/public/uploads#{path}"
    case File.rm_rf file_path do
      {:ok, _} ->
        conn
        |> put_status(:created)
        |> send_resp(:no_content, "")
      {:error, reason} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(KrishedgesSpace.ErrorView, "error.json", message: reason)
    end
  end

end

