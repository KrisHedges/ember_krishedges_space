defmodule KrishedgesSpace.PostCategory do
  use KrishedgesSpace.Web, :model

  schema "post_categories" do
    belongs_to :post, KrishedgesSpace.Post
    belongs_to :category, KrishedgesSpace.Category

    timestamps
  end

  @required_fields ~w(post_id category_id)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
  end
end
