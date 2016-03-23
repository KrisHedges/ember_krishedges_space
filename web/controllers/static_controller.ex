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
      Plug.Conn.send_file(conn, 200, "priv/static/#{full_path}")
    else
      public = File.read! "priv/static/public/index.html"
      html conn, public
    end
  end

  def public(conn, params) do
    public = File.read! "priv/static/public/index.html"
    html conn, public
  end

  def admin(conn, params) do
    admin = File.read! "priv/static/admin/index.html"
    html conn, admin
  end

  defp add_cache_headers(conn, _) do
    Plug.Conn.put_resp_header(conn, "cache-control", "public, max-age=31536000")
  end

end
