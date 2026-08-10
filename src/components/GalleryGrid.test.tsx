import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import GalleryGrid from "@/components/GalleryGrid";

vi.mock("next/image", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

const images = [
  { slug: "a", title: "Erstes Bild", image: "/uploads/a.jpg" },
  { slug: "b", title: "Zweites Bild", image: "/uploads/b.jpg" },
];

describe("GalleryGrid", () => {
  it("opens the lightbox as an accessible dialog when a thumbnail is clicked", () => {
    render(<GalleryGrid images={images} />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button")[0]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(dialog).toHaveAttribute("aria-modal", "true");
  });

  it("closes the lightbox when Escape is pressed", async () => {
    render(<GalleryGrid images={images} />);

    fireEvent.click(screen.getAllByRole("button")[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    fireEvent.keyDown(document, { key: "Escape" });
    // framer-motion's AnimatePresence keeps the dialog mounted until its
    // exit animation finishes, so the removal from the DOM is async.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("returns focus to the trigger thumbnail after closing", async () => {
    render(<GalleryGrid images={images} />);

    const trigger = screen.getAllByRole("button")[0];
    fireEvent.click(trigger);

    fireEvent.click(screen.getByRole("button", { name: "Schließen" }));
    // Focus is restored synchronously in the close handler, before the exit
    // animation finishes removing the dialog from the DOM.
    expect(trigger).toHaveFocus();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });
});
