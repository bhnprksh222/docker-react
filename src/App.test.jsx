import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";

test("renders Vite and React logos", () => {
  render(<App />);
  expect(screen.getByAltText("Vite logo")).toBeInTheDocument();
  expect(screen.getByAltText("React logo")).toBeInTheDocument();
});

test("renders main heading", () => {
  render(<App />);
  expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument();
});

test("increments count when button is clicked", () => {
  render(<App />);
  const button = screen.getByRole("button", { name: /count is/i });
  fireEvent.click(button);
  expect(button).toHaveTextContent("count is 1");
});
