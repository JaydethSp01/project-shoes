export interface User {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  telefono?: string;
  direccion?: string;
  rol: "user" | "admin";
  fechaRegistro?: string;
  ultimoLogin?: string;
  estado?: "activo" | "inactivo" | "suspendido";
  puntosFidelidad?: number;
  nivelUsuario?: "bronce" | "plata" | "oro" | "diamante";
  // Campos adicionales para compatibilidad con el frontend
  name?: string;
  role?: "user" | "admin";
  avatar?: string;
  phone?: string;
  address?: string;
  registrationDate?: string;
  lastLogin?: string;
  status?: "active" | "inactive" | "suspended";
  loyaltyPoints?: number;
  userLevel?: "Bronze" | "Silver" | "Gold" | "Platinum";
  totalPurchases?: number;
  favoriteCategories?: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

class AuthService {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  // Los usuarios ahora se obtienen del backend
  private users: User[] = [];

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

  async register(registerData: {
    name: string;
    email: string;
    password: string;
    role: "user" | "admin";
    phone?: string;
    address?: string;
  }): Promise<User> {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/usuarios/registro",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: registerData.name,
            email: registerData.email,
            password: registerData.password,
            telefono: registerData.phone || "",
            direccion: registerData.address || "",
            rol: registerData.role,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.usuario) {
        const user = this.normalizeUser(data.usuario);
        this.currentUser = user;
        localStorage.setItem("tekashi_user", JSON.stringify(user));
        this.notifyListeners();
        return user;
      } else {
        throw new Error(data.message || "Error en el registro");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      // Fallback a creación local en caso de error
      const existingUser = this.users.find(
        (u) => u.email === registerData.email
      );
      if (existingUser) {
        throw new Error("El email ya está registrado");
      }

      const newUser: User = {
        id: Date.now(),
        nombre: registerData.name,
        email: registerData.email,
        rol: registerData.role,
        telefono: registerData.phone,
        direccion: registerData.address,
        fechaRegistro: new Date().toISOString(),
        estado: "activo",
        puntosFidelidad: registerData.role === "user" ? 50 : 0,
        nivelUsuario: registerData.role === "user" ? "bronce" : "diamante",
        // Campos de compatibilidad
        name: registerData.name,
        role: registerData.role,
        phone: registerData.phone,
        address: registerData.address,
        registrationDate: new Date().toISOString(),
        status: "active",
        loyaltyPoints: registerData.role === "user" ? 50 : 0,
        userLevel: registerData.role === "user" ? "Bronze" : "Platinum",
        totalPurchases: 0,
        favoriteCategories: registerData.role === "user" ? [] : [],
      };

      this.users.push(newUser);

      // Auto-login después del registro
      this.currentUser = newUser;
      localStorage.setItem("tekashi_user", JSON.stringify(newUser));
      this.notifyListeners();

      return newUser;
    }
  }

  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(
        "https://backend-ecommerce-6vi3.onrender.com/api/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      const data = await response.json();

      if (data.success && data.usuario) {
        const user = this.normalizeUser(data.usuario);
        this.currentUser = user;
        localStorage.setItem("tekashi_user", JSON.stringify(user));
        this.notifyListeners();
        return user;
      } else {
        throw new Error(data.message || "Error en el login");
      }
    } catch (error) {
      console.error("Error during login:", error);
      throw new Error("Error de conexión. Por favor intenta de nuevo.");
    }
  }

  async logout(): Promise<void> {
    this.currentUser = null;
    localStorage.removeItem("tekashi_user");
    this.notifyListeners();
  }

  updateCurrentUser(updatedUser: any) {
    this.currentUser = updatedUser;
    localStorage.setItem("tekashi_user", JSON.stringify(updatedUser));
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
    // Permitir creación de usuarios durante el registro
    const newUser: User = {
      ...userData,
      id: Date.now(),
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

    const userIndex = this.users.findIndex((u) => u.id === Number(id));
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

    const userIndex = this.users.findIndex((u) => u.id === Number(id));
    if (userIndex === -1) {
      throw new Error("Usuario no encontrado");
    }

    this.users.splice(userIndex, 1);
  }

  // Métodos específicos para usuarios
  async getUserStats(): Promise<{
    totalPurchases: number;
    loyaltyPoints: number;
    userLevel: string;
    nextLevel: number;
    activeDiscount: string;
  }> {
    if (!this.isUser()) {
      throw new Error("Acceso denegado: se requiere ser usuario");
    }

    const user = this.currentUser!;
    return {
      totalPurchases: user.totalPurchases || 0,
      loyaltyPoints: user.loyaltyPoints || 0,
      userLevel: user.userLevel || "Bronze",
      nextLevel: this.calculateNextLevel(user.loyaltyPoints || 0),
      activeDiscount: this.getActiveDiscount(user.userLevel || "Bronze"),
    };
  }

  private calculateNextLevel(currentPoints: number): number {
    if (currentPoints < 100) return 100;
    if (currentPoints < 300) return 300;
    if (currentPoints < 500) return 500;
    return 1000;
  }

  private getActiveDiscount(level: string): string {
    const discounts: { [key: string]: string } = {
      Bronze: "5%",
      Silver: "10%",
      Gold: "15%",
      Platinum: "20%",
    };
    return discounts[level] || "5%";
  }

  async addLoyaltyPoints(points: number, _reason: string): Promise<void> {
    if (!this.isUser()) {
      throw new Error("Acceso denegado: se requiere ser usuario");
    }

    const user = this.currentUser!;
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;

    // Actualizar nivel si es necesario
    const newLevel = this.calculateUserLevel(user.loyaltyPoints);
    if (newLevel !== user.userLevel) {
      user.userLevel = newLevel;
    }

    localStorage.setItem("tekashi_user", JSON.stringify(user));
    this.notifyListeners();
  }

  private calculateUserLevel(
    points: number
  ): "Bronze" | "Silver" | "Gold" | "Platinum" {
    if (points >= 1000) return "Platinum";
    if (points >= 500) return "Gold";
    if (points >= 300) return "Silver";
    return "Bronze";
  }

  async updateUserProfile(profileData: {
    name?: string;
    phone?: string;
    address?: string;
  }): Promise<User> {
    if (!this.currentUser) {
      throw new Error("Usuario no autenticado");
    }

    const user = this.currentUser;
    user.name = profileData.name || user.name;
    user.phone = profileData.phone || user.phone;
    user.address = profileData.address || user.address;

    localStorage.setItem("tekashi_user", JSON.stringify(user));
    this.notifyListeners();

    return user;
  }

  async getUserNotifications(): Promise<
    Array<{
      id: number;
      title: string;
      message: string;
      type: string;
      read: boolean;
      date: string;
    }>
  > {
    if (!this.isUser()) {
      throw new Error("Acceso denegado: se requiere ser usuario");
    }

    // Simular notificaciones del usuario
    return [
      {
        id: 1,
        title: "¡Nueva oferta disponible!",
        message: "20% de descuento en zapatillas Nike",
        type: "oferta",
        read: false,
        date: "2024-01-16",
      },
      {
        id: 2,
        title: "Tu pedido ha sido enviado",
        message: "Tu pedido #TK987654321 está en camino",
        type: "pedido",
        read: true,
        date: "2024-01-14",
      },
      {
        id: 3,
        title: "¡Producto disponible!",
        message: "El producto en tu lista de deseos está disponible",
        type: "nuevo_producto",
        read: false,
        date: "2024-01-13",
      },
    ];
  }

  async getUserFavorites(): Promise<
    Array<{
      id: number;
      productId: number;
      dateAdded: string;
    }>
  > {
    if (!this.isUser()) {
      throw new Error("Acceso denegado: se requiere ser usuario");
    }

    // Simular favoritos del usuario
    return [
      {
        id: 1,
        productId: 72,
        dateAdded: "2024-01-10",
      },
      {
        id: 2,
        productId: 84,
        dateAdded: "2024-01-08",
      },
    ];
  }

  async getUserWishlists(): Promise<
    Array<{
      id: number;
      name: string;
      description?: string;
      productCount: number;
      createdDate: string;
    }>
  > {
    if (!this.isUser()) {
      throw new Error("Acceso denegado: se requiere ser usuario");
    }

    // Simular listas de deseos del usuario
    return [
      {
        id: 1,
        name: "Zapatillas de Running",
        description: "Para mis entrenamientos",
        productCount: 3,
        createdDate: "2024-01-10",
      },
      {
        id: 2,
        name: "Calzado Formal",
        description: "Para eventos especiales",
        productCount: 2,
        createdDate: "2024-01-08",
      },
    ];
  }

  // Método para normalizar el usuario del backend al formato del frontend
  private normalizeUser(backendUser: any): User {
    return {
      id: backendUser.id,
      nombre: backendUser.nombre,
      email: backendUser.email,
      telefono: backendUser.telefono,
      direccion: backendUser.direccion,
      rol: backendUser.rol,
      fechaRegistro: backendUser.fechaRegistro,
      ultimoLogin: backendUser.ultimoLogin,
      estado: backendUser.estado,
      puntosFidelidad: backendUser.puntosFidelidad,
      nivelUsuario: backendUser.nivelUsuario,
      // Campos de compatibilidad
      name: backendUser.nombre,
      role: backendUser.rol,
      phone: backendUser.telefono,
      address: backendUser.direccion,
      registrationDate: backendUser.fechaRegistro,
      lastLogin: backendUser.ultimoLogin,
      status:
        backendUser.estado === "activo"
          ? "active"
          : backendUser.estado === "inactivo"
          ? "inactive"
          : "suspended",
      loyaltyPoints: backendUser.puntosFidelidad,
      userLevel:
        backendUser.nivelUsuario === "bronce"
          ? "Bronze"
          : backendUser.nivelUsuario === "plata"
          ? "Silver"
          : backendUser.nivelUsuario === "oro"
          ? "Gold"
          : "Platinum",
      totalPurchases: 0, // Se calculará desde el backend
      favoriteCategories: [], // Se obtendrá desde el backend
    };
  }

  // Métodos de autenticación social que delegan a FirebaseAuthService
  async signInWithGoogle() {
    const { firebaseAuthService } = await import("./FirebaseAuthService");
    return await firebaseAuthService.signInWithGoogle();
  }

  async signInWithFacebook() {
    const { firebaseAuthService } = await import("./FirebaseAuthService");
    return await firebaseAuthService.signInWithFacebook();
  }

  async signInWithMicrosoft() {
    const { firebaseAuthService } = await import("./FirebaseAuthService");
    return await firebaseAuthService.signInWithMicrosoft();
  }
}

export const authService = new AuthService();
