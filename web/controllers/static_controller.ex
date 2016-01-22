defmodule KrishedgesSpace.StaticController do
  use KrishedgesSpace.Web, :controller

  def static_page(conn, params) do
    case conn.request_path do
      "/" ->
        redirect conn, to: "/public/index.html"
      "/admin" ->
        redirect conn, to: "/admin/index.html"
    end
  end


end
