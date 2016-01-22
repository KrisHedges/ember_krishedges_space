defmodule KrishedgesSpace.StaticController do
  use KrishedgesSpace.Web, :controller

  def public(conn, params) do
    case conn.request_path do
      "/" ->
        html conn, File.read! "priv/static/public/index.html"
      _ ->
        html conn, File.read! "priv/static/public/index.html"
    end
  end

  def admin(conn, params) do
    case conn.request_path do
      "/" ->
        html conn, File.read! "priv/static/admin/index.html"
      _ ->
        html conn, File.read! "priv/static/admin/index.html"
    end
  end

end
