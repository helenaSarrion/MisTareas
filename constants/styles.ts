import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// Este fichero sirve para centralizar los estilos de la aplicación y los colores utilizados en los componentes.
export const COLORS = {
  primary: '#004643',
  secondary: '#F0EDE5',
  accent: '#4CAF50',
  danger: '#e74c3c',
  warning: '#F9A826',
  info: '#45B7D1',
  text: {
    light: '#FFFFFF',
    dark: '#2c3e50',
    muted: 'rgba(255, 255, 255, 0.7)'
  }
};

export const SIZES = {
  padding: 16,
  margin: 8,
  radius: {
    small: 8,
    medium: 12,
    large: 20
  }
};

export const styles = StyleSheet.create({
  // Layout
  gradient: { flex: 1 },
  container: { flex: 1 },
  scrollView: { flex: 1, padding: SIZES.padding },
  
  // Header
  header: { padding: 20, paddingTop: 50, alignItems: "center" },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.text.light,
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: { 
    fontSize: 18, 
    color: COLORS.text.muted,
    textAlign: 'center'
  },
  
  // Calendario
  calendarContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: SIZES.radius.large,
    padding: SIZES.padding,
    marginBottom: SIZES.margin * 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  calendarTitle: {
    color: COLORS.text.light,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 10,
  },
  weekDayText: {
    color: COLORS.text.light,
    fontSize: 14,
    fontWeight: '600',
    width: (width - 80) / 7,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: (width - 80) / 7,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginVertical: 2,
    position: 'relative',
  },
  nonCurrentMonthDay: {
    opacity: 0.4,
  },
  todayDay: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedDay: {
    backgroundColor: COLORS.accent,
    transform: [{ scale: 1.1 }],
  },
  calendarDayText: {
    color: COLORS.text.light,
    fontSize: 16,
    fontWeight: '500',
  },
  nonCurrentMonthText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  todayText: {
    fontWeight: 'bold',
  },
  selectedDayText: {
    color: COLORS.text.light,
    fontWeight: 'bold',
  },
  tasksIndicatorContainer: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  moreTasksText: {
    color: COLORS.text.light,
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  
  // Resumen del día
  daySummary: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius.medium,
    padding: 20,
    marginBottom: SIZES.margin * 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  summaryTitle: {
    color: COLORS.text.light,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textAlign: 'center',
  },
  summarySubtitle: {
    color: COLORS.text.muted,
    fontSize: 14,
    textAlign: 'center',
  },
  
  // Tareas 
  tasksList: {
    paddingBottom: 100,
  },
  taskCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius.medium,
    marginBottom: SIZES.margin,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  taskCardContent: {
    flex: 1,
    padding: SIZES.padding,
  },
  taskTimeCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskTime: {
    color: COLORS.text.muted,
    fontSize: 14,
    fontWeight: '500',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: COLORS.text.light,
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  taskCardText: {
    color: COLORS.text.light,
    fontSize: 16,
    marginBottom: 8,
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  taskCardActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  completionIndicator: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopRightRadius: SIZES.radius.medium,
    borderBottomRightRadius: SIZES.radius.medium,
  },
  completionIndicatorCompleted: {
    backgroundColor: COLORS.accent,
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: SIZES.radius.medium,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  emptyText: {
    color: COLORS.text.muted,
    fontSize: 18,
    marginTop: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },
  
  // boton de acción
  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  
  // Forms
  taskFormModal: {
    backgroundColor: 'white',
    borderRadius: SIZES.radius.large,
    padding: 25,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  formInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: SIZES.radius.small,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: COLORS.text.dark,
  },
  categoriesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryOptionSelected: {
    borderWidth: 2,
    borderColor: 'white',
  },
  categoryOptionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 5,
  },
  formButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  formButton: {
    flex: 1,
    padding: 15,
    borderRadius: SIZES.radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { backgroundColor: COLORS.danger },
  saveButton: { backgroundColor: COLORS.accent },
  saveButtonDisabled: { opacity: 0.5 },
  formButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // Modales de edición
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: SIZES.radius.large,
    padding: 25,
    width: '90%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: COLORS.text.dark,
  },
  editInput: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: SIZES.radius.small,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: SIZES.radius.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  
  // Boton de acción
  editButton: { padding: 8, marginRight: 8 },
  deleteButton: { padding: 8 },
});