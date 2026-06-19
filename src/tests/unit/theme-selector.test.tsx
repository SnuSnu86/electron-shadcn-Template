import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ThemeSelector from "@/components/theme-selector";

test("renders all theme options", () => {
  render(<ThemeSelector />);

  expect(screen.getByRole("button", { name: /system/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /dunkel/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /hell/i })).toBeInTheDocument();
});

test("shows icons for each theme option", () => {
  render(<ThemeSelector />);

  const buttons = screen.getAllByRole("button");
  expect(buttons).toHaveLength(3);
  for (const button of buttons) {
    expect(button.querySelector("svg")).toBeInTheDocument();
  }
});
