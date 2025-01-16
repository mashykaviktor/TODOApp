import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { styles } from "./styles";
import TaskItem from "../components/TaskItem";

export interface Task {
  text: string;
  completed: boolean;
}

const Todo = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editIndex, setEditIndex] = useState(-1);

  const handleAddTask = () => {
    if (!task.trim()) {
      Alert.alert("Error", "Task cannot be empty");
      return;
    }

    if (editIndex !== -1) {
      const updatedTasks = tasks.map((item, index) =>
        index === editIndex ? { ...item, text: task.trim() } : item
      );
      setTasks(updatedTasks);
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { text: task.trim(), completed: false }]);
    }
    setTask("");
  };

  const handleEditTask = (index: number) => {
    setTask(tasks[index].text);
    setEditIndex(index);
  };

  const handleDeleteTask = (index: number) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this task?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setTasks(tasks.filter((_, i) => i !== index));
          },
        },
      ]
    );
  };

  const toggleTaskCompletion = (index: number) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      updatedTasks[index].completed = !updatedTasks[index].completed;
      return updatedTasks;
    });
  };

  const incompleteCount = tasks.filter((task) => !task.completed).length;

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>TODO</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={task}
        onChangeText={setTask}
        accessible={true}
        accessibilityLabel="Input for entering tasks"
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddTask}
        accessible={true}
        accessibilityLabel={
          editIndex !== -1 ? "Update task button" : "Add task button"
        }
      >
        <Text style={styles.addButtonText}>
          {editIndex !== -1 ? "Update Task" : "Add Task"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.counter}>Incomplete Tasks: {incompleteCount}</Text>
      {tasks.length === 0 ? (
        <Text style={styles.emptyMessage}>No tasks available</Text>
      ) : (
        <FlatList
          data={tasks}
          renderItem={({ item, index }) => (
            <TaskItem
              item={item}
              index={index}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleCompletion={toggleTaskCompletion}
            />
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      )}
    </View>
  );
};

export default Todo;
