defmodule KrishedgesSpace.UploadView do
  use KrishedgesSpace.Web, :view

  def render("index.json", %{uploads: uploads}) do
    %{uploads: render_many(uploads, KrishedgesSpace.UploadView, "upload.json")}
  end

  def render("upload.json", %{upload: upload}) do
    %{filename: upload.filename,
      path: upload.path,
      type: upload.type}
  end
end

