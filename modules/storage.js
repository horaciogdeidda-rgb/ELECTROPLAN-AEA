/**
 * ELECTROPLAN.AEA - Módulo de Persistencia en localStorage
 * Permite guardar, listar y cargar históricos de memorias de cálculo y presupuestos técnicos.
 */

const STORAGE_KEY = 'electroplan_aea_projects';

export class StorageManager {
  // Obtener la lista completa de proyectos guardados
  static listProjects() {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY);
      if (!rawData) return [];
      const list = JSON.parse(rawData);
      // Ordenar por fecha desc (el más reciente primero)
      return list.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    } catch (e) {
      console.error("Error al leer el historial de localStorage", e);
      return [];
    }
  }

  // Guardar o actualizar un proyecto
  static saveProject(id, { name, calculatorState, budgetItems }) {
    try {
      const projects = this.listProjects();
      const timestamp = new Date().toISOString();
      
      const projectData = {
        id: id || 'proj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        name: name || 'Cálculo sin nombre',
        calculatorState: calculatorState || {},
        budgetItems: budgetItems || [],
        timestamp
      };

      const existingIndex = projects.findIndex(p => p.id === projectData.id);
      
      if (existingIndex !== -1) {
        // Actualizar existente
        projects[existingIndex] = projectData;
      } else {
        // Añadir nuevo
        projects.push(projectData);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      return projectData;
    } catch (e) {
      console.error("Error al guardar el proyecto en localStorage", e);
      return null;
    }
  }

  // Cargar un proyecto por ID
  static loadProject(id) {
    try {
      const projects = this.listProjects();
      return projects.find(p => p.id === id) || null;
    } catch (e) {
      console.error(`Error al cargar el proyecto con ID ${id}`, e);
      return null;
    }
  }

  // Eliminar un proyecto por ID
  static deleteProject(id) {
    try {
      const projects = this.listProjects();
      const filtered = projects.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (e) {
      console.error(`Error al borrar el proyecto con ID ${id}`, e);
      return false;
    }
  }

  // Obtener la cantidad de proyectos guardados
  static getCount() {
    return this.listProjects().length;
  }
}
