import React, { memo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";
import { styles } from "./styles";

import type { Task } from "../features/Todo";

export interface TaskItemProps {
  item: Task;
  index: number;
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  onToggleCompletion: (index: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = memo(
  ({ item, index, onEdit, onDelete, onToggleCompletion }) => (
    <View style={styles.task}>
      <Checkbox
        value={item.completed}
        onValueChange={() => onToggleCompletion(index)}
        color={item.completed ? "green" : undefined}
        accessible={true}
        accessibilityLabel={`Mark task ${item.text} as ${
          item.completed ? "incomplete" : "complete"
        }`}
      />
      <Text style={[styles.itemList, item.completed && styles.completedText]}>
        {item.text}
      </Text>
      <View style={styles.taskButtons}>
        <TouchableOpacity onPress={() => onEdit(index)}>
          <Text style={styles.editButton}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(index)}>
          <Text style={styles.deleteButton}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
);

export default TaskItem;
