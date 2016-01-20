defmodule KrishedgesSpace.Auth do
  import Plug.Conn
  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  def login_by_username_and_pass(conn, user, given_pass) do
    if checkpw(given_pass, user.password_hash) do
      Guardian.encode_and_sign(user, :api)
    else
      {:error, :unauthorized, conn}
    end
  end

end

