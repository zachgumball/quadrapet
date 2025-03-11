import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { text: "Home", path: "/" },
    { text: "Tentang Kami", path: "/about" },
    { text: "Galeri", path: "/gallery" },
    { text: "Jurnal", path: "/journal" },
  ];

  return (
    <nav className="w-full bg-blue-600 shadow-md fixed top-0 left-0 z-50">
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <h1 className="text-white text-3xl font-extrabold tracking-wide cursor-pointer transition-transform duration-300 hover:rotate-12">
          <span className="inline-block bg-white text-blue-600 px-3 py-1 rounded-full shadow-lg">
            Q
          </span>
        </h1>

        {/* Burger Button (Mobile) */}
        <button
          className="lg:hidden text-white"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={30} />
        </button>

        {/* Menu (Desktop) */}
        <ul className="hidden lg:flex space-x-6">
          {navLinks.map((link, index) => (
            <li key={index} className="relative group">
              <Link
                href={link.path}
                className="text-white font-medium text-lg transition duration-300 group-hover:text-yellow-300"
              >
                {link.text}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Tombol Login / Logout (Desktop) */}
        <div className="hidden lg:block">
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-5 py-2 text-white font-medium bg-red-500 rounded-lg shadow-md transition duration-300 hover:bg-red-600 hover:scale-105"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <button className="px-5 py-2 text-white font-medium bg-green-500 rounded-lg shadow-md transition duration-300 hover:bg-green-600 hover:scale-105">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Overlay & Menu (Mobile) */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className="fixed top-0 right-0 w-3/4 h-full bg-blue-800 shadow-lg flex flex-col items-center justify-center space-y-6 z-50"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tombol Close Menu (X) */}
              <button
                className="absolute top-5 right-5 text-white"
                onClick={() => setMenuOpen(false)}
              >
                <X size={30} />
              </button>

              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.path}
                  className="text-white text-xl font-medium hover:text-yellow-300 transition"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.text}
                </Link>
              ))}

              {/* Tombol Login / Logout (Mobile) */}
              {session ? (
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut();
                  }}
                  className="px-5 py-2 text-white font-medium bg-red-500 rounded-lg shadow-md transition duration-300 hover:bg-red-600 hover:scale-105"
                >
                  Logout
                </button>
              ) : (
                <Link href="/login">
                  <button
                    onClick={() => setMenuOpen(false)}
                    className="px-5 py-2 text-white font-medium bg-green-500 rounded-lg shadow-md transition duration-300 hover:bg-green-600 hover:scale-105"
                  >
                    Login
                  </button>
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
