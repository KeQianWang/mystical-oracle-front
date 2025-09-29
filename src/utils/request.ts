// 通用响应接口
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: {
    code: string | number;
    message: string;
    details?: any;
  };
}

// 通用请求封装函数
export const request = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    // 处理HTTP错误状态
    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}`;

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // 如果解析错误体失败，使用默认错误信息
      }

      return {
        success: false,
        data: null as T,
        error: {
          code: response.status,
          message: errorMessage,
        },
      };
    }

    const responseData = await response.json();

    // 处理业务逻辑错误（后端返回的格式可能是 { success, data, error } 或其他格式）
    if (responseData.success === false || responseData.error) {
      return {
        success: false,
        data: null as T,
        error: {
          code: responseData.error?.code || "BUSINESS_ERROR",
          message: responseData.error?.message || responseData.message || "业务逻辑错误",
          details: responseData.error?.details || responseData.details,
        },
      };
    }

    // 统一返回格式，支持以下格式：
    // 1. { success, data, error }
    // 2. { data }
    // 3. 直接返回数据
    return {
      success: true,
      data: responseData.data !== undefined ? responseData.data : responseData,
    };
  } catch (error) {
    // 处理网络错误、JSON解析错误等
    return {
      success: false,
      data: null as T,
      error: {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "网络请求失败",
      },
    };
  }
};

// 便捷的GET请求方法
export const get = <T = any>(url: string, options?: Omit<RequestInit, 'method'>): Promise<ApiResponse<T>> => {
  return request<T>(url, { ...options, method: 'GET' });
};

// 便捷的POST请求方法
export const post = <T = any>(url: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

// 便捷的PUT请求方法
export const put = <T = any>(url: string, data?: any, options?: Omit<RequestInit, 'method' | 'body'>): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// 便捷的DELETE请求方法
export const del = <T = any>(url: string, options?: Omit<RequestInit, 'method'>): Promise<ApiResponse<T>> => {
  return request<T>(url, { ...options, method: 'DELETE' });
};