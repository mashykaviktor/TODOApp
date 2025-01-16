import React from "react";
import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import { Alert } from "react-native";
import Todo from "../Todo";

jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
  if (buttons) {
    const deleteButton = buttons.find((button) => button.text === "Delete");
    if (deleteButton && deleteButton.onPress) deleteButton.onPress();
  }
});

describe("Todo", () => {
  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = render(<Todo />);
    expect(getByText("TODO")).toBeTruthy();
    expect(getByPlaceholderText("Enter task")).toBeTruthy();
    expect(getByText("Add Task")).toBeTruthy();
    expect(getByText("Incomplete Tasks: 0")).toBeTruthy();
    expect(getByText("No tasks available")).toBeTruthy();
  });

  it("adds a task", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Todo />);
    const input = getByPlaceholderText("Enter task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "New Task");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(queryByText("No tasks available")).toBeNull();
      expect(getByText("New Task")).toBeTruthy();
      expect(getByText("Incomplete Tasks: 1")).toBeTruthy();
    });
  });

  it("does not add an empty task", async () => {
    const { getByText } = render(<Todo />);
    const addButton = getByText("Add Task");

    fireEvent.press(addButton);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Error", "Task cannot be empty");
    });
  });

  it("edits a task", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<Todo />);
    const input = getByPlaceholderText("Enter task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Task to Edit");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(queryByText("No tasks available")).toBeNull();
      expect(getByText("Task to Edit")).toBeTruthy();
    });

    const editButton = getByText("Edit");
    fireEvent.press(editButton);

    await waitFor(() => {
      expect(input.props.value).toBe("Task to Edit");
    });

    fireEvent.changeText(input, "Edited Task");
    fireEvent.press(getByText("Update Task"));

    await waitFor(() => {
      expect(queryByText("Task to Edit")).toBeNull();
      expect(getByText("Edited Task")).toBeTruthy();
    });
  });

  it("deletes a task", async () => {
    jest.spyOn(Alert, "alert");
    const { getByPlaceholderText, getByText, queryByText } = render(<Todo />);
    const input = getByPlaceholderText("Enter task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Task to Delete");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(queryByText("No tasks available")).toBeNull();
      expect(getByText("Task to Delete")).toBeTruthy();
    });

    const deleteButton = getByText("Delete");
    fireEvent.press(deleteButton);

    await act(async () => {
      const alertMock = (Alert.alert as jest.Mock).mock;
      expect(alertMock.calls.length).toBeGreaterThan(0);
    });

    await waitFor(() => {
      expect(queryByText("Task to Delete")).toBeNull();
      expect(getByText("No tasks available")).toBeTruthy();
    });
  });

  it("toggles task completion", async () => {
    const { getByPlaceholderText, getByText, getByLabelText } = render(
      <Todo />
    );
    const input = getByPlaceholderText("Enter task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Task to Complete");
    fireEvent.press(addButton);

    await waitFor(() => {
      expect(getByText("Task to Complete")).toBeTruthy();
      expect(getByText("Incomplete Tasks: 1")).toBeTruthy();
    });

    const taskItemCheckbox = getByLabelText(
      "Mark task Task to Complete as complete"
    );
    fireEvent.press(taskItemCheckbox);

    await waitFor(() => {
      expect(getByText("Incomplete Tasks: 0")).toBeTruthy();
    });

    fireEvent.press(taskItemCheckbox);

    await waitFor(() => {
      expect(getByText("Incomplete Tasks: 1")).toBeTruthy();
    });
  });
});
