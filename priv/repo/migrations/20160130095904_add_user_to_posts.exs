defmodule KrishedgesSpace.Repo.Migrations.AddUserToPosts do
  use Ecto.Migration

  def change do
    alter table(:posts) do
      add :user_id, :integer
      add :edits, {:array, :map}, default: []
    end
  end
end
