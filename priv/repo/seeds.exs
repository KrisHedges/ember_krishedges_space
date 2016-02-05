# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     KrishedgesSpace.Repo.insert!(%SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.
alias KrishedgesSpace.User
alias KrishedgesSpace.Post

admin_changeset = User.changeset(%User{},%{username: "admin", email: "admin@example.com", password: "123456", role: "admin"})
editor_changeset = User.changeset(%User{},%{username: "editor", email: "editor@example.com", password: "123456", role: "editor"})
author_changeset = User.changeset(%User{},%{username: "author", email: "author@example.com", password: "123456", role: "author"})
admin = KrishedgesSpace.Repo.insert!(admin_changeset)
editor = KrishedgesSpace.Repo.insert!(editor_changeset)
author = KrishedgesSpace.Repo.insert!(author_changeset)

post1_changeset = Post.changeset(%Post{},%{title: "Mattis Cursus Sollicitudin", slug: "mattis-cursus-sollicitudin-1", body: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum.", published: true, published_at: "2016-01-29T04:50:48Z", user_id: admin.id, edits: [ %{user_id: admin.id} ] })
post2_changeset = Post.changeset(%Post{},%{title: "Mattis Cursus Sollicitudin", slug: "mattis-cursus-sollicitudin-2", body: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum.", published: true, published_at: "2016-01-29T04:50:48Z", user_id: editor.id, edits: [ %{user_id: editor.id} ] })
post3_changeset = Post.changeset(%Post{},%{title: "Mattis Cursus Sollicitudin", slug: "mattis-cursus-sollicitudin-3", body: "Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum. Cras mattis consectetur purus sit amet fermentum.", published: true, published_at: "2016-01-29T04:50:48Z", user_id: author.id, edits: [ %{user_id: author.id} ] })
KrishedgesSpace.Repo.insert!(post1_changeset)
KrishedgesSpace.Repo.insert!(post2_changeset)
KrishedgesSpace.Repo.insert!(post3_changeset)
