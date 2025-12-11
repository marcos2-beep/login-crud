import { TaskList } from "@/components/tasks/task-list";
import { Header } from "@/components/ui/header";
import { Task } from "@/constants/types";
import { todoService } from "@/services/todo.service";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../components/context/auth-context";

export default function HomeScreen() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const reloadTasks = useCallback(async () => {
    console.log("HomeScreen - Estado del usuario:", user);
    if (!user || !user.token) {
      console.log("No hay usuario o token, limpiando tareas");
      setTasks([]);
      return;
    }
    console.log("Usuario autenticado, obteniendo tareas");
    setLoading(true);
    try {
      const fetchedTodos = await todoService.getTodos(user.token);
      console.log("Tareas obtenidas::", fetchedTodos);
      setTasks(fetchedTodos);
    } catch (err) {
      console.error("Error al obtener las tareas", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reloadTasks();
  }, [reloadTasks]);

  useFocusEffect(
    useCallback(() => {
      reloadTasks();
    }, [reloadTasks])
  );

  const handleToggleTask = async (taskId: string) => {
    if (!user?.token) return;

    const taskToUpdate = tasks.find(t => t.id === taskId);
    if (!taskToUpdate) return;

    const previousTasks = [...tasks];
    const updated = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updated);

    try {
      await todoService.updateTodo(user.token, taskId, { completed: !taskToUpdate.completed });
    } catch (error) {
      console.error("Error al actualizar las tareas", error);
      setTasks(previousTasks);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!user?.token) return;

    const previousTasks = [...tasks];
    const updated = tasks.filter((task) => task.id !== taskId);
    setTasks(updated);

    try {
      await todoService.deleteTodo(user.token, taskId);
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      setTasks(previousTasks);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Header title="Todo List" />
        <View style={styles.statusBadge}>
          <View style={[styles.statusDot, { backgroundColor: user?.token ? '#10b981' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {user?.token ? 'API Conectada ✓' : 'API Desconectada ✗'}
          </Text>
        </View>
      </View>

      <TaskList
        tasks={tasks}
        onToggleTask={handleToggleTask}
        onDeleteTask={handleDeleteTask}
      />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5fb",
    padding: 24,
    paddingBottom: 0,
  },
  headerContainer: {
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
});
