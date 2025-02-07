import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DATA_NAME = "DATA";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function setLocalStorage(window: Window, objects: any) {
  if (window) {
    let existedData = JSON.parse(
      window.localStorage.getItem(DATA_NAME) || "{}"
    );
    existedData = {
      ...existedData,
      ...objects,
    };
    window.localStorage.setItem(DATA_NAME, JSON.stringify(existedData));
  }
}

export function getLocalStorage(window: Window, key: string) {
  if (window) {
    const data = JSON.parse(window.localStorage.getItem(DATA_NAME) || "{}");
    return data[key];
  }
  return null;
}

// 判断字符串是否是一个合法的字符串对象
export function isValidJSONObject(str: string) {
  // 先判断字符串是否为空或不是字符串
  if (typeof str !== "string" || str.trim() === "") {
    return false;
  }

  try {
    const parsed = JSON.parse(str);
    // 判断解析后的结果是否是对象且不为null
    return parsed && typeof parsed === "object" && !Array.isArray(parsed);
  } catch (e) {
    return false;
  }
}

// 下载文件
export function onDownloadHandle(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}