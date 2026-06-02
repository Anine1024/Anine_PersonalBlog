---
slug: "axios-二次封装从原理解析到项目落地"
title: "Axios 二次封装：从原理解析到项目落地"
date: "2026-06-02"
category: "前端开发"
tags: ["react axios 原理解析 二次封装"]
excerpt: "深入解析 Axios 的核心原理，并基于 React 项目实践一套高复用、可维护的二次封装方案，涵盖拦截器、错误处理、API 统一管理等关键环节。"
readingTime: 8
featured: false
---

## 引言

在前端项目开发中，网络请求是绕不开的核心环节。Axios 凭借其基于 Promise、支持浏览器和 Node.js、提供拦截器机制等特性，已成为最流行的 HTTP 客户端之一。然而，在实际项目中直接使用 Axios 往往会导致代码冗余、错误处理混乱、API 管理分散等问题。

“封装一次，终身受益”——这句话在开发者社区广为流传。本文将带你从 Axios 的原理解析入手，逐步深入二次封装的最佳实践，并结合 React 项目给出可落地的代码方案。无论你是刚接触 Axios 的新手，还是希望优化现有封装的老手，相信都能从中获得启发。

## 一、Axios 核心原理解析

### 1.1 Axios 是什么？

Axios 是一个基于 `XMLHttpRequest`（浏览器端）和 `http` 模块（Node.js 端）的 Promise 封装库。它的核心设计思想是：**提供一个统一的、可配置的 HTTP 请求接口，同时通过拦截器机制允许开发者在请求和响应阶段插入自定义逻辑**。

### 1.2 核心特性

- **Promise 驱动**：所有请求返回 Promise，支持 `async/await` 语法。
- **请求/响应拦截器**：可以在请求发送前和响应返回后执行自定义逻辑。
- **自动转换 JSON 数据**：默认将响应数据转换为 JSON。
- **取消请求**：支持通过 `CancelToken` 取消正在进行的请求。
- **防御 XSRF**：内置跨站请求伪造防护机制。

### 1.3 简单示例

```javascript
import axios from 'axios';

// GET 请求
axios.get('/api/user', { params: { id: 1 } })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST 请求
axios.post('/api/login', { username: 'admin', password: '123456' })
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

上述代码虽然简洁，但在大型项目中，每个请求都需要重复配置 baseURL、超时时间、请求头等参数，且错误处理分散在各处，维护成本极高。

## 二、为什么需要二次封装？

### 2.1 痛点分析

1. **配置重复**：每个请求都要写 `baseURL`、`timeout`、`headers`。
2. **错误处理混乱**：HTTP 状态码错误、网络异常、业务错误码混杂在一起。
3. **API 管理分散**：接口 URL 散落在各个组件中，难以统一管理和修改。
4. **缺少统一拦截**：无法在请求前统一添加 Token、在响应后统一处理登录过期等。

### 2.2 封装目标

- **统一配置**：baseURL、超时时间、请求头等全局配置。
- **拦截器分离**：请求拦截（Token 注入）和响应拦截（错误统一处理）。
- **API 分层管理**：将接口按模块拆分，集中维护。
- **类型安全（TypeScript）**：为请求参数和响应数据提供类型定义。

## 三、React 项目中的二次封装实践

### 3.1 目录结构建议

```
src/
├── api/
│   ├── index.ts          # 统一导出
│   ├── request.ts        # Axios 实例与拦截器
│   └── modules/          # 按业务模块划分
│       ├── user.ts
│       └── order.ts
├── types/
│   └── api.ts            # 接口类型定义
```

### 3.2 创建 Axios 实例与拦截器

```typescript
// src/api/request.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 创建 Axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 从 localStorage 获取 Token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 假设后端返回格式：{ code: number, data: any, message: string }
    if (res.code === 0) {
      return res.data;
    } else {
      // 业务错误处理
      ElMessage.error(res.message || '请求失败');
      if (res.code === 401) {
        // Token 过期，跳转登录页
        window.location.href = '/login';
      }
      return Promise.reject(new Error(res.message));
    }
  },
  (error) => {
    // HTTP 网络错误处理
    if (error.response) {
      switch (error.response.status) {
        case 404:
          ElMessage.error('请求资源不存在');
          break;
        case 500:
          ElMessage.error('服务器错误');
          break;
        default:
          ElMessage.error('网络错误');
      }
    } else {
      ElMessage.error('网络连接失败');
    }
    return Promise.reject(error);
  }
);

export default service;
```

**关键点**：
- 使用 `import.meta.env` 获取环境变量，支持不同环境配置。
- 请求拦截器统一注入 Token，避免每个请求手动添加。
- 响应拦截器区分 HTTP 错误和业务错误，并给出用户友好的提示。

### 3.3 模块化 API 管理

```typescript
// src/api/modules/user.ts
import service from '../request';

// 定义接口类型
export interface LoginParams {
  username: string;
  password: string;
}

export interface UserInfo {
  id: number;
  name: string;
  avatar: string;
}

// API 函数
export const login = (data: LoginParams): Promise<string> => {
  return service.post('/user/login', data);
};

export const getUserInfo = (): Promise<UserInfo> => {
  return service.get('/user/info');
};

export const logout = (): Promise<void> => {
  return service.post('/user/logout');
};
```

```typescript
// src/api/modules/order.ts
export interface OrderItem {
  id: number;
  productName: string;
  price: number;
  status: 'pending' | 'completed';
}

export const getOrderList = (params: { page: number }): Promise<OrderItem[]> => {
  return service.get('/order/list', { params });
};
```

**优势**：
- 每个模块独立文件，职责清晰。
- 接口变更只需修改对应模块，不影响其他业务。
- 配合 TypeScript，调用时能获得完整的类型提示。

### 3.4 统一导出与使用

```typescript
// src/api/index.ts
export * from './modules/user';
export * from './modules/order';
```

在组件中使用：

```tsx
import { login, getUserInfo } from '@/api';

const LoginPage: React.FC = () => {
  const handleLogin = async () => {
    try {
      const token = await login({ username: 'admin', password: '123456' });
      localStorage.setItem('token', token);
      const userInfo = await getUserInfo();
      console.log('用户信息:', userInfo);
    } catch (error) {
      console.error('登录失败', error);
    }
  };

  return <button onClick={handleLogin}>登录</button>;
};
```

## 四、进阶封装技巧

### 4.1 动态 API 支持

某些场景下，接口 URL 需要动态拼接参数，例如 `/user/123`。可以封装一个通用函数：

```typescript
// src/api/request.ts
export const createApi = (baseUrl: string) => {
  return {
    get: (id: string | number) => service.get(`${baseUrl}/${id}`),
    update: (id: string | number, data: any) => service.put(`${baseUrl}/${id}`, data),
    delete: (id: string | number) => service.delete(`${baseUrl}/${id}`)
  };
};

// 使用
const userApi = createApi('/user');
userApi.get(123).then(data => console.log(data));
```

### 4.2 取消重复请求

防止用户在短时间内重复点击提交按钮，可以基于 `CancelToken` 实现：

```typescript
// 存储请求标识与取消函数
const pendingMap = new Map<string, AbortController>();

const getRequestKey = (config: AxiosRequestConfig): string => {
  return `${config.method}:${config.url}`;
};

service.interceptors.request.use((config) => {
  const key = getRequestKey(config);
  // 如果已有相同请求，取消之前的
  if (pendingMap.has(key)) {
    pendingMap.get(key)!.abort();
  }
  const controller = new AbortController();
  config.signal = controller.signal;
  pendingMap.set(key, controller);
  return config;
});

service.interceptors.response.use(
  (response) => {
    const key = getRequestKey(response.config);
    pendingMap.delete(key);
    return response;
  },
  (error) => {
    if (axios.isCancel(error)) {
      console.log('请求已取消');
    }
    return Promise.reject(error);
  }
);
```

### 4.3 请求重试机制

对于重要的请求，可以添加重试逻辑：

```typescript
const retryRequest = async (config: AxiosRequestConfig, retries = 3): Promise<any> => {
  try {
    return await service(config);
  } catch (error) {
    if (retries > 0 && !axios.isCancel(error)) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 延迟1秒
      return retryRequest(config, retries - 1);
    }
    throw error;
  }
};
```

## 五、封装后的效果与收益

通过上述二次封装，我们获得了以下收益：

1. **开发效率提升**：API 调用只需一行代码，无需重复配置。
2. **错误处理统一**：所有错误在拦截器中集中处理，业务代码更干净。
3. **可维护性增强**：接口修改只需改动对应模块文件，风险可控。
4. **类型安全**：TypeScript 保证了参数和返回值的正确性。
5. **扩展性良好**：可以轻松添加日志、埋点、请求缓存等高级功能。

## 总结

Axios 的二次封装不是炫技，而是为了解决实际项目中的痛点。本文从 Axios 的原理出发，逐步构建了一套适合 React 项目的封装方案，包括：

- **统一实例配置**与**拦截器**分离
- **模块化 API 管理**与**类型定义**
- **动态 API**、**请求取消**、**重试机制**等进阶技巧

封装的核心思想是**分层**与**复用**：将网络请求的通用逻辑抽离到 `request.ts`，将业务接口按模块拆分，让组件只关心业务逻辑本身。

记住：好的封装不是为了写更少的代码，而是为了让代码更清晰、更可维护。希望本文能帮助你在项目中写出更优雅的 Axios 封装。

---

**参考文章**：
- [前端架构带你 封装axios，一次封装终身受益](https://juejin.cn/post/7124573626161954823)
- [axios 二次封装 api的统筹管理](https://juejin.cn/post/6844903712016564231)
- [Axios的封装思想及实践（TS版本）](https://juejin.cn/post/7023006049732919309)