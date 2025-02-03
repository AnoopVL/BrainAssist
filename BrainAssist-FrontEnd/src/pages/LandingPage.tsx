import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, Video, Twitter, Lightbulb, Share2 } from "lucide-react";
import { motion } from "framer-motion";

export function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-purple-600 via-purple-500 to-purple-400">
      {/* Cyberpunk-like moving background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`,
          transition: "background-image 0.3s ease-out",
        }}>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCI+CiAgPHJlY3Qgd2lkdGg9IjMwIiBoZWlnaHQ9IjMwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIj48L3JlY3Q+Cjwvc3ZnPg==')] opacity-20" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center text-white mb-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 20,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="flex justify-center mb-6">
            <Brain className="h-16 w-16" />
          </motion.div>
          <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200">
            Brain Assist
          </h1>
          <p className="text-xl mb-8">
            Your digital second brain for capturing and organizing content
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/signin")}
            className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:shadow-lg">
            Get Started
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Video,
              title: "Save Videos",
              description:
                "Save and organize your favorite YouTube videos with notes and timestamps for easy reference.",
            },
            {
              icon: Twitter,
              title: "Capture Tweets",
              description:
                "Save important tweets and threads to reference later, complete with context and your insights.",
            },
            {
              icon: Lightbulb,
              title: "Store Thoughts",
              description:
                "Capture your ideas, insights, and reflections in a structured way that makes them easy to find later.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)",
              }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-6 text-white border border-white border-opacity-20">
              <div className="flex items-center mb-4">
                <feature.icon className="h-6 w-6 mr-2" />
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Feature */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-white mb-16">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20">
            <Share2 className="h-4 w-4 mr-2" />
            <span>Sharing features coming soon!</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
