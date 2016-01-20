defmodule KrishedgesSpace.UserView do
  use KrishedgesSpace.Web, :view

  def render("index.json", %{users: users}) do
    %{data: render_many(users, KrishedgesSpace.UserView, "user.json")}
  end

  def render("show.json", %{user: user, token: token}) do
    %{
      data: render_one(user, KrishedgesSpace.UserView, "user.json"),
      token: token
    }
  end

  def render("show.json", %{user: user}) do
    %{data: render_one(user, KrishedgesSpace.UserView, "user.json")}
  end

  def render("user.json", %{user: user}) do
    %{id: user.id,
      username: user.username
    }
  end

  def render("error.json", %{message: message}) do
    %{error: message}
  end

end
