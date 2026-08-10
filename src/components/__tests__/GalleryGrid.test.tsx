import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import GalleryGrid from "@/components/GalleryGrid";

const images = [
  { slug: "a", title: "Boxenstopp-Training", image: "/uploads/a.jpg" },
  { slug: "b", title: "Fahrzeugpräsentation", image: "/uploads/b.jpg" },
  { slug: "c", title: "Werkstattnacht", image: "/uploads/c.jpg" },
];

describe("GalleryGrid", () => {
  it("opens a dialog with the clicked image's title on click", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid images={images} />);

    await user.click(screen.getAllByRole("button")[1]);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-label", "Fahrzeugpräsentation");
  });

  it("closes the dialog when Escape is pressed", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid images={images} />);

    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("navigates to the next image with the ArrowRight key", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid images={images} />);

    await user.click(screen.getAllByRole("button")[0]);
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Boxenstopp-Training");

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Fahrzeugpräsentation");
  });

  it("navigates to the previous image with the ArrowLeft key, wrapping around", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid images={images} />);

    await user.click(screen.getAllByRole("button")[0]);
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-label", "Werkstattnacht");
  });
});
