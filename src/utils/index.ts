import Cookies from "js-cookie";
export function getUserType(user: string | number) {
  const phoneReg = /^1[3-9][0-9]{9}$/ as any;
  const mailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/ as any;
  if (mailReg.test(user)) {
    return "email";
  }
  if (phoneReg.test(user)) {
    return "phone";
  }
  return false;
}

export function LS_set(key: string, data: any) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function LS_get(key: string) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

export function LS_remove(key: string) {
  localStorage.removeItem(key);
}

export const getIdx = <T extends unknown>(
  arr: T[],
  i: T,
  key: keyof T
): number => {
  return arr.findIndex((m) => m[key] === i[key]);
};

export const getrandomData = <T extends unknown>(
  arr: T[],
  i?: T,
  key?: keyof T
): T | null => {
  if (!arr.length) {
    return null;
  }
  if (!i || !key) {
    const re = Math.floor(Math.random() * arr.length);
    return arr[re];
  }
  const FILTER = arr.filter((m: T) => {
    return m[key] !== i[key];
  });
  const re = Math.floor(Math.random() * FILTER.length);

  return FILTER[re];
};

export const setCookie = (name: string, data: string) => {
  Cookies.set(name, data,{
    sameSite: 'none',
    secure: true
  });
};

export const getCookie = (name: string) => {
  return Cookies.get(name);
};

export const removeCookie = (name: string) => {
  return Cookies.remove(name);
};
