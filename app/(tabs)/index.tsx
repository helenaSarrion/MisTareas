import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Keyboard,
  Alert,
  Modal,
  TouchableWithoutFeedback,
  ListRenderItem,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Importar estilos desde el archivo separado
import { styles, COLORS } from '../../constants/styles';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  time?: string;
  category?: string;
}

// Obtener el ancho de la pantalla para el gradient
const { width } = Dimensions.get("window");
import type { ColorValue } from "react-native";
const GRADIENT_COLORS: [ColorValue, ColorValue] = [COLORS.secondary, COLORS.primary];
const STORAGE_KEY = "@tasks";

// Categorías de tareas con colores
const TASK_CATEGORIES = {
  assignment: { name: "Asignatura", color: "#FF6B6B", icon: "book" },
  personal: { name: "Personal", color: "#4ECDC4", icon: "person" },
  workout: { name: "Ejercicio", color: "#45B7D1", icon: "barbell" },
  meeting: { name: "Reunión", color: "#F9A826", icon: "people" },
  event: { name: "Evento", color: "#BB6BD9", icon: "calendar" },
};

export default function HomeScreen() {
  const [task, setTask] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [taskCategory, setTaskCategory] = useState("assignment");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editText, setEditText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const editInputRef = useRef<TextInput>(null);

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                     "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const fullDayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Obtener días del mes para el calendario
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Días del mes anterior
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        date: new Date(year, month - 1, prevMonthDays - i).toISOString().split('T')[0]
      });
    }
    
    // Días del mes actual
    const today = new Date();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        currentMonth: true,
        date: new Date(year, month, i).toISOString().split('T')[0],
        isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear()
      });
    }
    
    // Días del próximo mes
    const totalCells = 42;
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        day: i,
        currentMonth: false,
        date: new Date(year, month + 1, i).toISOString().split('T')[0]
      });
    }
    
    return days;
  }, [currentMonth]);

  // Tareas filtradas por fecha seleccionada
  const filteredTasks = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return tasks
      .filter(task => task.date === selectedDateStr)
      .sort((a, b) => {
        if (a.time && b.time) return a.time.localeCompare(b.time);
        return 0;
      });
  }, [tasks, selectedDate]);

  const completedTasksCount = useMemo(
    () => filteredTasks.filter((task) => task.completed).length,
    [filteredTasks]
  );

  // Cargar y guardar tareas
  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };

  const saveTasks = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  }, [tasks]);

  // Añadir nueva tarea
  const addTask = useCallback(() => {
    if (task.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: task.trim(),
        completed: false,
        date: selectedDate.toISOString().split('T')[0],
        time: taskTime,
        category: taskCategory
      };

      setTasks((prev) => [newTask, ...prev]);
      setTask("");
      setTaskTime("");
      setTaskCategory("assignment");
      setShowTaskForm(false);
      Keyboard.dismiss();
    }
  }, [task, taskTime, taskCategory, selectedDate]);

  // Funciones para editar tareas
  const startEditing = useCallback((task: Task) => {
    setEditingTask(task);
    setEditText(task.text);
    setModalVisible(true);
  }, []);

  const saveEdit = useCallback(() => {
    if (editingTask && editText.trim()) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editingTask.id ? { ...task, text: editText.trim() } : task
        )
      );
      setModalVisible(false);
      setEditingTask(null);
      setEditText("");
    }
  }, [editingTask, editText]);

  const cancelEdit = useCallback(() => {
    setModalVisible(false);
    setEditingTask(null);
    setEditText("");
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    Alert.alert(
      "Eliminar tarea",
      "¿Estás seguro de que quieres eliminar esta tarea?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            setTasks((prev) => prev.filter((task) => task.id !== id));
          },
        },
      ]
    );
  }, []);

  // Navegación del calendario 
  const goToPreviousMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  }, []);

  const goToNextMonth = useCallback(() => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  }, []);

  const handleDateSelect = useCallback((date: string) => {
    setSelectedDate(new Date(date));
  }, []);

  // Renderizado de tareas
  const renderTaskItem: ListRenderItem<Task> = useCallback(
    ({ item }) => {
      const category = TASK_CATEGORIES[item.category as keyof typeof TASK_CATEGORIES] || TASK_CATEGORIES.assignment;
      
      return (
        <TouchableOpacity
          style={[styles.taskCard, { borderLeftColor: category.color }]}
          onPress={() => toggleTask(item.id)}
          onLongPress={() => startEditing(item)}
        >
          <View style={styles.taskCardContent}>
            <View style={styles.taskTimeCategory}>
              {item.time && <Text style={styles.taskTime}>{item.time}</Text>}
              <View style={[styles.categoryBadge, { backgroundColor: category.color }]}>
                <Ionicons name={category.icon as any} size={12} color="white" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </View>
            </View>
            
            <Text
              style={[
                styles.taskCardText,
                item.completed && styles.taskTextCompleted,
              ]}
              numberOfLines={2}
            >
              {item.text}
            </Text>
            
            <View style={styles.taskCardActions}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => startEditing(item)}
              >
                <Ionicons name="create-outline" size={16} color="#4CAF50" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteTask(item.id)}
              >
                <Ionicons name="trash-outline" size={16} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={[
            styles.completionIndicator,
            item.completed && styles.completionIndicatorCompleted
          ]}>
            {item.completed && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
        </TouchableOpacity>
      );
    },
    [toggleTask, startEditing, deleteTask]
  );

  const keyExtractor = useCallback((item: Task) => item.id, []);

  const emptyListComponent = useMemo(
    () => (
      <View style={styles.emptyState}>
        <Ionicons name="calendar-outline" size={60} color="rgba(255,255,255,0.3)" />
        <Text style={styles.emptyText}>No hay tareas para este día</Text>
        <Text style={styles.emptySubtext}>
          Presiona el botón + para agregar una nueva tarea
        </Text>
      </View>
    ),
    []
  );

  // Componente del calendario
  const CalendarView = useMemo(() => (
    <View style={styles.calendarContainer}>
      {/* Header del calendario */}
      <View style={styles.calendarHeader}>
        <TouchableOpacity onPress={goToPreviousMonth}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.calendarTitle}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={goToNextMonth}>
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={styles.weekDaysContainer}>
        {dayNames.map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>
      
      {/* Grid de días */}
      <View style={styles.calendarGrid}>
        {calendarDays.map((dayInfo, index) => {
          const isSelected = selectedDate.toISOString().split('T')[0] === dayInfo.date;
          const dayTasks = tasks.filter(task => task.date === dayInfo.date);
          const hasTasks = dayTasks.length > 0;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.calendarDay,
                !dayInfo.currentMonth && styles.nonCurrentMonthDay,
                dayInfo.isToday && styles.todayDay,
                isSelected && styles.selectedDay
              ]}
              onPress={() => handleDateSelect(dayInfo.date)}
            >
              <Text style={[
                styles.calendarDayText,
                !dayInfo.currentMonth && styles.nonCurrentMonthText,
                dayInfo.isToday && styles.todayText,
                isSelected && styles.selectedDayText
              ]}>
                {dayInfo.day}
              </Text>
              
              {/* Indicadores de tareas */}
              {hasTasks && (
                <View style={styles.tasksIndicatorContainer}>
                  {dayTasks.slice(0, 3).map((task, i) => {
                    const category = TASK_CATEGORIES[task.category as keyof typeof TASK_CATEGORIES] || TASK_CATEGORIES.assignment;
                    return (
                      <View 
                        key={i} 
                        style={[
                          styles.taskDot, 
                          { backgroundColor: task.completed ? '#4CAF50' : category.color }
                        ]} 
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <Text style={styles.moreTasksText}>+{dayTasks.length - 3}</Text>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  ), [calendarDays, currentMonth, selectedDate, tasks, handleDateSelect, goToPreviousMonth, goToNextMonth]);

  return (
    <LinearGradient colors={GRADIENT_COLORS} style={styles.gradient}>
      <View style={styles.container}>
        {/* Header principal */}
        <View style={styles.header}>
          <Text style={styles.title}>📅 Mi Calendario</Text>
          <Text style={styles.subtitle}>
            {fullDayNames[selectedDate.getDay()]}, {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
          </Text>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Calendario */}
          {CalendarView}

          {/* Resumen del día */}
          <View style={styles.daySummary}>
            <Text style={styles.summaryTitle}>
              {filteredTasks.length > 0 ? 
                `Tienes ${filteredTasks.length} tareas para hoy` : 
                "🎉 No hay tareas programadas para hoy"
              }
            </Text>
            {completedTasksCount > 0 && (
              <Text style={styles.summarySubtitle}>
                {completedTasksCount} completada{completedTasksCount !== 1 ? 's' : ''}
              </Text>
            )}
          </View>

          {/* Lista de tareas del día */}
          {filteredTasks.length > 0 ? (
            <FlatList
              data={filteredTasks}
              renderItem={renderTaskItem}
              keyExtractor={keyExtractor}
              scrollEnabled={false}
              contentContainerStyle={styles.tasksList}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={60} color="rgba(255,255,255,0.3)" />
              <Text style={styles.emptyText}>No hay tareas para este día</Text>
              <Text style={styles.emptySubtext}>
                Presiona el botón + para agregar una nueva tarea
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Botón flotante para añadir tarea */}
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={() => setShowTaskForm(true)}
        >
          <Ionicons name="add" size={30} color="white" />
        </TouchableOpacity>

        {/* Modal para añadir tarea */}
        <Modal
          visible={showTaskForm}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTaskForm(false)}
        >
          <TouchableWithoutFeedback onPress={() => setShowTaskForm(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.taskFormModal}>
                  <Text style={styles.modalTitle}>➕ Nueva Tarea</Text>
                  
                  <TextInput
                    style={styles.formInput}
                    placeholder="¿Qué necesitas hacer?"
                    placeholderTextColor="#999"
                    value={task}
                    onChangeText={setTask}
                  />
                  
                  <TextInput
                    style={styles.formInput}
                    placeholder="Hora (opcional) - ej: 14:30"
                    placeholderTextColor="#999"
                    value={taskTime}
                    onChangeText={setTaskTime}
                  />
                  
                  <Text style={styles.formLabel}>Categoría:</Text>
                  {/* Categorías de tareas y selección */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
                    {Object.entries(TASK_CATEGORIES).map(([key, category]) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.categoryOption,
                          taskCategory === key && styles.categoryOptionSelected,
                          { backgroundColor: category.color }
                        ]}
                        onPress={() => setTaskCategory(key)}
                      >
                        <Ionicons name={category.icon as any} size={16} color="white" />
                        <Text style={styles.categoryOptionText}>{category.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                  
                  <View style={styles.formButtons}>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.cancelButton]}
                      onPress={() => setShowTaskForm(false)}
                    >
                      <Text style={styles.formButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.formButton, styles.saveButton, !task.trim() && styles.saveButtonDisabled]}
                      onPress={addTask}
                      disabled={!task.trim()}
                    >
                      <Text style={styles.formButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Modal de edición */}
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={cancelEdit}
        >
          <TouchableWithoutFeedback onPress={cancelEdit}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text style={styles.modalTitle}>✏️ Editar Tarea</Text>
                  <TextInput
                    ref={editInputRef}
                    style={styles.editInput}
                    value={editText}
                    onChangeText={setEditText}
                    placeholder="Edita tu tarea..."
                    placeholderTextColor="#999"
                    multiline={true}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={[styles.modalButton, styles.cancelButton]}
                      onPress={cancelEdit}
                    >
                      <Text style={styles.modalButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.modalButton,
                        styles.saveButton,
                        !editText.trim() && styles.saveButtonDisabled,
                      ]}
                      onPress={saveEdit}
                      disabled={!editText.trim()}
                    >
                      <Text style={styles.modalButtonText}>Guardar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </LinearGradient>
  );
}