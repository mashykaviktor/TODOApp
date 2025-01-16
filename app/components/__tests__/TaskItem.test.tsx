import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import TaskItem, { TaskItemProps } from "../TaskItem";

describe("TaskItem", () => {
  const mockTask = {
    text: "Test Task",
    completed: false,
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnToggleCompletion = jest.fn();

  const defaultProps: TaskItemProps = {
    item: mockTask,
    index: 0,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    onToggleCompletion: mockOnToggleCompletion,
  };

  it("renders task text correctly", () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    expect(getByText("Test Task")).toBeTruthy();
  });

  it("calls onToggleCompletion when checkbox is pressed", () => {
    const { getByLabelText } = render(<TaskItem {...defaultProps} />);
    const checkbox = getByLabelText("Mark task Test Task as complete");
    fireEvent.press(checkbox);
    expect(mockOnToggleCompletion).toHaveBeenCalledWith(0);
  });

  it("calls onEdit when edit button is pressed", () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    const editButton = getByText("Edit");
    fireEvent.press(editButton);
    expect(mockOnEdit).toHaveBeenCalledWith(0);
  });

  it("calls onDelete when delete button is pressed", () => {
    const { getByText } = render(<TaskItem {...defaultProps} />);
    const deleteButton = getByText("Delete");
    fireEvent.press(deleteButton);
    expect(mockOnDelete).toHaveBeenCalledWith(0);
  });
});
