defmodule KrishedgesSpace.Repo.Migrations.CreatePost do
  use Ecto.Migration

  def change do
    create table(:posts) do
      add :title, :string
      add :slug, :string
      add :body, :text
      add :published, :boolean, default: false
      add :published_at, :date

      timestamps
    end
    create unique_index(:posts, [:slug])
  end
end
