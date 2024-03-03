"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("991964f3-94a7-4bef-9963-044061e470a1");
  }, []);

  return null;
};