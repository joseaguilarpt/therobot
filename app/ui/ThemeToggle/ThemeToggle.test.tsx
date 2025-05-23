import ThemeToggle from "./ThemeToggle";
import {render, screen } from "@testing-library/react";
import { ThemeProvider } from "~/context/ThemeContext";

describe("ThemeToggle", () => {
  it("Renderiza correctamente con ícono de luna por defecto", () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>
    );
    const icon = screen.getByTestId("data-icon");
    expect(icon).toHaveTextContent("moon");
  });
});
