defmodule KrishedgesSpace.StaticController do
  use KrishedgesSpace.Web, :controller
  plug :add_cache_headers
  require IEx

  def files(conn, %{"path" => path}) do
    full_path = ""
    if List.first(path) === "assets" do
      full_path = Enum.join(List.insert_at(path, 0, "public"), "/")
    else
      full_path = Enum.join(path, "/")
    end
    if File.exists?("priv/static/#{full_path}") do
      conn
      |> put_resp_content_type(Plug.MIME.path("priv/static/#{full_path}"), "utf-8")
      |> Plug.Conn.send_file(200, "priv/static/#{full_path}")
    else
      public_html = File.read! "priv/static/public/index.html"
      conn
      |> put_resp_header("Content-Type", "text/html")
      |> html(public_html)
    end
  end

  def public(conn, params) do
    public_html = File.read! "priv/static/public/index.html"
    conn
    |> put_resp_header("Content-Type", "text/html")
    |> html(public_html)
  end

  def admin(conn, params) do
    admin = File.read! "priv/static/admin/index.html"
    html conn, admin
  end

  defp add_cache_headers(conn, _) do
    Plug.Conn.put_resp_header(conn, "cache-control", "public, max-age=31536000")
  end

end
