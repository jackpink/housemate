"use client";

export function CoverImage({ url }: { url: string }) {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();

        const file = e.target as HTMLInputElement;
        console.log("file", file.files);

        if (!file) {
          throw new Error("No file");
        }

        const image = await fetch(url, {
          body: file,
          method: "PUT",
          headers: {
            "Content-Type": file.type,
            "Content-Disposition": `attachment; filename="${file.name}"`,
          },
        });
      }}
    >
      <input name="file" type="file" accept="image/png, image/jpeg" />
      <button type="submit">Upload</button>
    </form>
  );
}
