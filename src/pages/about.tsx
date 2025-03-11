import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { motion } from "framer-motion";
import Head from "next/head";

const friends = [
  { name: "Heri", role: "Web Developer", image: "/friends/heri.jpg", description: "Si pengotak-atik kode, suka bikin proyek keren dan eksplor teknologi baru." },
  { name: "Rodit", role: "Pencatat Kenangan", image: "/friends/rodit.jpg", description: "Si pengarsip perjalanan, memastikan setiap momen terekam dalam video dan foto." },
  { name: "Robi", role: "Petualang", image: "/friends/robi.jpg", description: "Si pecinta alam, selalu ngajakin naik gunung dan eksplor tempat baru." },
  { name: "Matin", role: "Penyemangat", image: "/friends/matin.jpg", description: "Si penyemangat yang jenaka, selalu menghibur di setiap perjalanan." },
];

const About = () => {
  return (
    <>
    <Head>
      <title>Tentang Kami | Quadrapet</title>
    </Head>
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden">
      {/* Efek Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black z-[-1] overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-10 h-10 bg-blue-500/10 rounded-full"
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: Math.random() * 5 + 5, repeat: Infinity }}
              style={{
                top: `${Math.random() * 100}vh`,
                left: `${Math.random() * 100}vw`,
              }}
            ></motion.div>
          ))}
        </div>
      </div>

      <Navbar />
      <main className="relative flex-grow flex flex-col items-center py-32 px-6">
        <motion.h1
          className="text-5xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text leading-tight"
          initial={{ opacity: 0, y: -30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", type: "spring", stiffness: 80 }}
        >
          Tentang Kami
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-center max-w-2xl leading-relaxed opacity-80"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        >
          Kami adalah sekelompok sahabat yang telah melalui banyak petualangan bersama. Dari mendaki gunung hingga sekadar ngopi santai, setiap momen selalu berharga.
        </motion.p>
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {friends.map((friend, index) => (
            <motion.div
              key={index}
              className="relative p-6 bg-gray-800/80 rounded-xl shadow-lg text-center transition-all duration-500 hover:scale-[1.08] hover:shadow-blue-500/50 border border-gray-600/50 group overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl"
                animate={{ opacity: [0.1, 0.4, 0.1] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div whileHover={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 0.3 }}>
              <Image
  src={friend.image}
  width={150}
  height={150}
  alt={friend.name}
  className="mx-auto rounded-full shadow-lg transition-transform duration-500 group-hover:scale-110 object-cover aspect-square"
/>

              </motion.div>
              <h2 className="mt-4 text-2xl font-semibold text-blue-300">{friend.name}</h2>
              <p className="text-gray-400">{friend.role}</p>
              <p className="mt-3 text-sm leading-relaxed opacity-90">{friend.description}</p>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
    </>
  );
};

export default About;
