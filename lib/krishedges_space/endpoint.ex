defmodule KrishedgesSpace.Endpoint do
  use Phoenix.Endpoint, otp_app: :krishedges_space

  socket "/socket", KrishedgesSpace.UserSocket

  # Serve at "/" the static files from "priv/static" directory.
  #
  # You should set gzip to true if you are running phoenix.digest
  # when deploying your static files in production.
  plug Plug.Static,
    at: "/", from: :krishedges_space, gzip: true, cache_control_for_etags: "public, max-age=31536000", cache_control_for_vsn_requests: "public, max-age=31536000",
    only: ~w(public admin css fonts images js favicon.ico robots.txt)

  # Code reloading can be explicitly enabled under the
  # :code_reloader configuration of your endpoint.
  if code_reloading? do
    socket "/phoenix/live_reload/socket", Phoenix.LiveReloader.Socket
    plug Phoenix.LiveReloader
    plug Phoenix.CodeReloader
  end

  plug Plug.RequestId
  plug Plug.Logger

  plug Plug.Parsers,
    parsers: [:urlencoded, :multipart, :json],
    pass: ["*/*"],
    json_decoder: Poison

  plug Plug.MethodOverride
  plug Plug.Head

  plug Plug.Session,
    store: :cookie,
    key: "_krishedges_space_key",
    signing_salt: "PG0GBOeA"

  plug Corsica, [origins: ["http://localhost:4200"], allow_headers: ["accept", "authorization"]]

  plug KrishedgesSpace.Router
end
