defmodule KrishedgesSpace.Post do
  use KrishedgesSpace.Web, :model

  schema "posts" do
    field :title, :string
    field :slug, :string
    field :body, :string
    field :description, :string
    field :published, :boolean, default: false
    field :published_at, Ecto.DateTime
    belongs_to :user, KrishedgesSpace.User
    has_many :post_categories, KrishedgesSpace.PostCategory, on_replace: :delete, on_delete: :delete_all
    has_many :categories, through: [:post_categories, :category], on_replace: :delete, on_delete: :delete_all
    embeds_many :edits, KrishedgesSpace.Edit, on_replace: :delete

    timestamps
  end

  @required_fields ~w(title body user_id)
  @optional_fields ~w(published_at published slug description)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> cast_embed(:edits)
    |> cast_assoc(:post_categories)
    |> unique_constraint(:slug)
  end
end
