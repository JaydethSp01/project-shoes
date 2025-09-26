// Endpoint Validator - Validates all backend endpoints
interface EndpointTest {
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  description: string;
  requiresAuth?: boolean;
  isAdmin?: boolean;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:10000";

export const ENDPOINTS: EndpointTest[] = [
  // Public endpoints
  { url: "/api/simple", method: "GET", description: "Simple health check" },
  { url: "/api/producto", method: "GET", description: "Get all products" },
  {
    url: "/api/tipo_producto",
    method: "GET",
    description: "Get product types",
  },
  { url: "/api/imagenes", method: "GET", description: "Get images" },

  // User endpoints (require auth)
  {
    url: "/api/usuarios",
    method: "GET",
    description: "Get users",
    requiresAuth: true,
  },
  {
    url: "/api/favoritos",
    method: "GET",
    description: "Get favorites",
    requiresAuth: true,
  },
  {
    url: "/api/wishlists",
    method: "GET",
    description: "Get wishlists",
    requiresAuth: true,
  },
  {
    url: "/api/notificaciones",
    method: "GET",
    description: "Get notifications",
    requiresAuth: true,
  },
  {
    url: "/api/pedidos",
    method: "GET",
    description: "Get orders",
    requiresAuth: true,
  },
  {
    url: "/api/reviews",
    method: "GET",
    description: "Get reviews",
    requiresAuth: true,
  },
  {
    url: "/api/dashboard",
    method: "GET",
    description: "Get dashboard data",
    requiresAuth: true,
  },

  // Admin endpoints
  {
    url: "/api/admin/dashboard",
    method: "GET",
    description: "Admin dashboard",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/backup",
    method: "POST",
    description: "Database backup",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/optimize",
    method: "POST",
    description: "Database optimize",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/stats",
    method: "GET",
    description: "Database stats",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/create-user",
    method: "POST",
    description: "Create user",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/delete-user",
    method: "POST",
    description: "Delete user",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/update-role",
    method: "POST",
    description: "Update user role",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/logs",
    method: "GET",
    description: "System logs",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/import-products",
    method: "POST",
    description: "Import products",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/export-catalog",
    method: "POST",
    description: "Export catalog",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/delete-product",
    method: "POST",
    description: "Delete product",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/config/email",
    method: "POST",
    description: "Configure email",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/config/payments",
    method: "POST",
    description: "Configure payments",
    requiresAuth: true,
    isAdmin: true,
  },
  {
    url: "/api/admin/config/shipping",
    method: "POST",
    description: "Configure shipping",
    requiresAuth: true,
    isAdmin: true,
  },
];

interface TestResult {
  endpoint: string;
  method: string;
  status: "success" | "error" | "unauthorized" | "forbidden";
  statusCode: number;
  responseTime: number;
  error?: string;
}

export class EndpointValidator {
  private results: TestResult[] = [];

  async validateAllEndpoints(): Promise<TestResult[]> {
    console.log("🔍 Starting endpoint validation...");
    this.results = [];

    for (const endpoint of ENDPOINTS) {
      await this.validateEndpoint(endpoint);
      // Small delay to avoid overwhelming the server
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    this.printResults();
    return this.results;
  }

  private async validateEndpoint(endpoint: EndpointTest): Promise<void> {
    const startTime = Date.now();

    try {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add auth token if required
      if (endpoint.requiresAuth) {
        const token = localStorage.getItem("firebase_token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }

      const response = await fetch(`${BASE_URL}${endpoint.url}`, {
        method: endpoint.method,
        headers,
      });

      const responseTime = Date.now() - startTime;

      let status: TestResult["status"] = "success";
      if (response.status === 401) status = "unauthorized";
      else if (response.status === 403) status = "forbidden";
      else if (response.status >= 400) status = "error";

      this.results.push({
        endpoint: endpoint.url,
        method: endpoint.method,
        status,
        statusCode: response.status,
        responseTime,
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      this.results.push({
        endpoint: endpoint.url,
        method: endpoint.method,
        status: "error",
        statusCode: 0,
        responseTime,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private printResults(): void {
    console.log("\n📊 Endpoint Validation Results:");
    console.log("================================");

    const successCount = this.results.filter(
      (r) => r.status === "success"
    ).length;
    const errorCount = this.results.filter((r) => r.status === "error").length;
    const unauthorizedCount = this.results.filter(
      (r) => r.status === "unauthorized"
    ).length;
    const forbiddenCount = this.results.filter(
      (r) => r.status === "forbidden"
    ).length;

    console.log(`✅ Success: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`🔒 Unauthorized: ${unauthorizedCount}`);
    console.log(`🚫 Forbidden: ${forbiddenCount}`);
    console.log(`📈 Total: ${this.results.length}`);

    console.log("\n📋 Detailed Results:");
    this.results.forEach((result) => {
      const statusIcon =
        result.status === "success"
          ? "✅"
          : result.status === "unauthorized"
          ? "🔒"
          : result.status === "forbidden"
          ? "🚫"
          : "❌";

      console.log(
        `${statusIcon} ${result.method} ${result.endpoint} - ${result.statusCode} (${result.responseTime}ms)`
      );

      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
  }

  getResults(): TestResult[] {
    return this.results;
  }

  getSuccessRate(): number {
    if (this.results.length === 0) return 0;
    const successCount = this.results.filter(
      (r) => r.status === "success"
    ).length;
    return (successCount / this.results.length) * 100;
  }
}

// Export a singleton instance
export const endpointValidator = new EndpointValidator();

// Helper function to run validation
export const validateEndpoints = async (): Promise<TestResult[]> => {
  return await endpointValidator.validateAllEndpoints();
};
