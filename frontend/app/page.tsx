"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import DotBackground from "../components/dot-background";
export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <DotBackground />
      <main>
      
      </main>
      
    </>
  );
}
