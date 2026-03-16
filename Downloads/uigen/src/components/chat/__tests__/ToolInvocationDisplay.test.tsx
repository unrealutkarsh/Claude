import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationDisplay } from "../ToolInvocationDisplay";

afterEach(() => {
  cleanup();
});

test("shows 'Created' label for completed str_replace_editor create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("shows 'Creating' label for in-progress str_replace_editor create command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create", path: "/components/Card.jsx" }}
    />
  );

  expect(screen.getByText("Creating Card.jsx")).toBeDefined();
});

test("shows 'Edited' label for completed str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "str_replace", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Edited App.jsx")).toBeDefined();
});

test("shows 'Editing' label for in-progress str_replace command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "str_replace", path: "/utils/helpers.js" }}
    />
  );

  expect(screen.getByText("Editing helpers.js")).toBeDefined();
});

test("shows 'Editing' label for insert command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "insert", path: "/App.jsx" }}
    />
  );

  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Viewed' label for completed view command", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "view", path: "/App.jsx" }}

    />
  );

  expect(screen.getByText("Viewed App.jsx")).toBeDefined();
});

test("shows 'Renamed' label for completed file_manager rename command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="result"
      args={{ command: "rename", path: "/old.jsx", new_path: "/new.jsx" }}

    />
  );

  expect(screen.getByText("Renamed old.jsx")).toBeDefined();
});

test("shows 'Deleting' label for in-progress file_manager delete command", () => {
  render(
    <ToolInvocationDisplay
      toolName="file_manager"
      state="call"
      args={{ command: "delete", path: "/temp.jsx" }}
    />
  );

  expect(screen.getByText("Deleting temp.jsx")).toBeDefined();
});

test("shows green dot for completed state", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/App.jsx" }}

    />
  );

  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
});

test("shows spinner for in-progress state", () => {
  const { container } = render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create", path: "/App.jsx" }}
    />
  );

  expect(container.querySelector(".animate-spin")).toBeDefined();
});

test("falls back to toolName for unknown tools", () => {
  render(
    <ToolInvocationDisplay
      toolName="unknown_tool"
      state="call"
      args={{}}
    />
  );

  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("handles missing path gracefully", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="call"
      args={{ command: "create" }}
    />
  );

  expect(screen.getByText("Creating")).toBeDefined();
});

test("extracts filename from nested path", () => {
  render(
    <ToolInvocationDisplay
      toolName="str_replace_editor"
      state="result"
      args={{ command: "create", path: "/components/ui/Button.jsx" }}

    />
  );

  expect(screen.getByText("Created Button.jsx")).toBeDefined();
});
