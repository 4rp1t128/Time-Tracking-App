"use client";
import { useState, useEffect } from "react";

const useLogin = () => {
  const [token, setToken] = useState(null);
  const [check, setCheck] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    (async () => {
      const t = await cookieStore.get("token");
      console.log(t);
      if (!t) {
        setCheck(true);
        setIsLogin(false);
        return;
      }
      const resp = await fetch("/api/token_verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: t.value }),
        credentials: "include",
      });
      const data = await resp.json();
      if (data.success) {
        setToken(t);
        setIsLogin(true);
      }
      setCheck(true);
    })();
  }, []);

  return { isLogin, check, token };
};

export default useLogin;
