defmodule KrishedgesSpace.Category do
  use KrishedgesSpace.Web, :model

  schema "categories" do
    field :name, :string
    field :description, :string
    has_many :post_categories, KrishedgesSpace.PostCategory
    has_many :posts, through: [:post_categories, :post]
    timestamps
  end

  @required_fields ~w(name description)
  @optional_fields ~w()

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> cast_assoc(:post_categories)
  end
end
