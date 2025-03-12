import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import Image from "next/image";
import Head from "next/head";

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) {
      const hasRefreshed = localStorage.getItem("hasRefreshed");

      if (!hasRefreshed) {
        localStorage.setItem("hasRefreshed", "true");
        window.location.reload();
      } else {
        localStorage.removeItem("hasRefreshed");
      }
    }
  }, [isMobile]);

  return (
    <>
      <Head>
        <title>Home | Quadrapet</title>
      </Head>
      <div className="relative flex flex-col min-h-screen bg-black text-white overflow-hidden">
        {/* Efek Aurora Background */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-[150px]"
            animate={isMobile ? {} : { opacity: [0.3, 0.5, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Floating Light Orbs (Hanya di layar besar) */}
        {!isMobile &&
          [...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-10 h-10 bg-white/20 rounded-full blur-xl"
              initial={{ x: Math.random() * 100 + "vw", y: Math.random() * 100 + "vh" }}
              animate={{ y: ["0vh", "100vh"], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}

        <Navbar />

        <main className="flex-grow flex flex-col items-center justify-center text-center px-6 pt-24 relative">
          {/* Judul */}
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold tracking-wide leading-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            Tribute <span className="text-blue-400">Sahabat</span> Sejati
          </motion.h1>

          {/* Deskripsi */}
          <motion.p
            className="mt-4 text-base md:text-lg max-w-md md:max-w-xl opacity-80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            <span className="inline-block animate-pulse">Momen-momen berharga</span> yang tidak akan pernah terlupakan, terekam dalam kenangan, tertulis dalam sejarah persahabatan.
          </motion.p>

          {/* Gambar */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <Image
              src="/strangerkampret.png"
              width={450}
              height={350}
              sizes="(max-width: 768px) 80vw, 450px"
              alt="Foto Persahabatan"
              className="rounded-xl shadow-lg shadow-blue-500/30"
            />
          </motion.div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Home;