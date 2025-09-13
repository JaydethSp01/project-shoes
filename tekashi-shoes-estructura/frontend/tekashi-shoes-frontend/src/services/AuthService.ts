export interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  // Usuarios de prueba
  private users: User[] = [
    {
      id: "1",
      name: "Usuario Cliente",
      email: "user@tekashi.com",
      role: "user",
      avatar: "/avatar-user.jpg",
    },
    {
      id: "2",
      name: "Administrador",
      email: "admin@tekashi.com",
      role: "admin",
      avatar: "/avatar-admin.jpg",
    },
  ];

  constructor() {
    // Cargar usuario desde localStorage si existe
    const savedUser = localStorage.getItem("tekashi_user");
    if (savedUser) {
      try {
        this.currentUser = JSON.parse(savedUser);
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("tekashi_user");
      }
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user = this.users.find((u) => u.email === credentials.email);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Validación básica de contraseña (en producción usar hash)
    const validPasswords: { [key: string]: string } = {
      "user@tekashi.com": "user123",
      "admin@tekashi.com": "admin456"
    };

    if (credentials.password !== validPasswords[credentials.email]) {
      throw new Error("Contraseña incorrecta");
    }

    this.currentUser = user;
    localStorage.setItem("tekashi_user", JSON.stringify(user));
    this.notifyListeners();

    return user;
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("tekashi_user");
    this.notifyListeners();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === "admin";
  }

  isUser(): boolean {
    return this.currentUser?.role === "user";
  }

  subscribe(listener: (user: User | null) => void): () => void {
    this.listeners.push(listener);

    // Llamar inmediatamente con el usuario actual
    listener(this.currentUser);

    // Retornar función de unsubscribe
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.currentUser));
  }

  // Métodos para admin
  async getUsers(): Promise<User[]> {
    if (!this.isAdmin()) {
      throw new Error(
        "Acceso denegado: se requieren permisos de administrador"
      );
    }
    return this.users;
  }

  async createUser(userData: Omit<User, "id">): Promise<User> {
    if (!this.isAdmin()) {
      throw new Error(
        "Acceso denegado: se requieren permisos de administrador"
      );
    }

    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
    };

    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    if (!this.isAdmin()) {
      throw new Error(
        "Acceso denegado: se requieren permisos de administrador"
      );
    }

    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado");
    }

    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.isAdmin()) {
      throw new Error(
        "Acceso denegado: se requieren permisos de administrador"
      );
    }

    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado");
    }

    this.users.splice(userIndex, 1);
  }
}

export const authService = new AuthService();
