defmodule KrishedgesSpace.CategoryView do
  use KrishedgesSpace.Web, :view
  require IEx

  def render("index.json", %{categories: categories}) do
    %{categories: render_many(categories, KrishedgesSpace.CategoryView, "category.json")}
  end

  def render("show.json", %{category: category}) do
    %{category: render_one(category, KrishedgesSpace.CategoryView, "category.json")}
  end

  def render("category.json", %{category: category}) do
    %{id: category.id,
      name: category.name,
      description: category.description,
      posts: Enum.map(category.posts, fn(p) -> p.id end),
      inserted_at: category.inserted_at
    }
  end
end
