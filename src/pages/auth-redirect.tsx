import { useEffect } from "react";
import { useRouter } from "next/router";

const AuthRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 2000); // Delay 2 detik sebelum redirect

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="p-6 bg-gray-800 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Mengalihkan ke Login...</h1>
        <p className="text-gray-400">Harap tunggu sebentar</p>
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    </div>
  );
};

export default AuthRedirect;
