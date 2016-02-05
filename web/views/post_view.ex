defmodule KrishedgesSpace.PostView do
  use KrishedgesSpace.Web, :view

  def render("index.json", %{posts: posts}) do
    %{posts: render_many(posts, KrishedgesSpace.PostView, "post.json")}
  end

  def render("show.json", %{post: post}) do
    %{post: render_one(post, KrishedgesSpace.PostView, "post.json")}
  end

  def render("post.json", %{post: post}) do
    %{id: post.id,
      title: post.title,
      slug: post.slug,
      body: post.body,
      published: post.published,
      published_at: post.published_at,
      inserted_at: post.inserted_at,
      user_id: post.user_id,
      edits: render_many(post.edits, KrishedgesSpace.PostView, "edit.json", as: :edit)}
  end

  def render("edit.json", %{edit: edit}) do
    %{id: edit.id,
      inserted_at: edit.inserted_at,
      user_id: edit.user_id}
  end

end
