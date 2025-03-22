import { useEffect, useState } from "react";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Camera,
  CameraOff,
  Cctv,
  CheckCircle,
  Zap,
  PlusCircle,
  MinusCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { FiRefreshCcw } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import StatCard from "../components/common/StatCard";
import AlertOverviewChart from "../components/overview/AlertOverviewChart";
import CategoryDistributionChart from "../components/overview/CategoryDistributionChart";
import SalesChannelChart from "../components/overview/AlertSourcesChart";
import dashboardStats from "../../../backend/data/dashboardStats.json";
import { Player } from "@lottiefiles/react-lottie-player";

const ContentWithLottie = () => (
  <div className="flex items-center justify-center mb-8 space-x-8">
    {/* Lottie Animation */}
    <Player
      autoplay
      loop
      src="DoomCCTV.json"
      className="w-32 h-32"
    />

    {/* Content */}
    <div className="flex flex-col items-center text-center">
      <img
        src="etherium.png"
        alt="ZenSafe Logo"
        className="w-20 h-15 object-contain mb-3"
      />
      <div className="text-4xl font-extrabold tracking-wide mt-1 mb-3">
        <span className="bg-gradient-to-t from-[#00E68F] via-[#00B378] to-[#007F5E] bg-clip-text text-transparent">
          ZEN
        </span>{" "}
        <span className="bg-gradient-to-b from-[#00E68F] via-[#00B378] to-[#007F5E] bg-clip-text text-transparent">
          SAFE
        </span>
      </div>
      <p className="text-gray-400 text-lg max-w-2xl mt-1 leading-relaxed">
        ZenSafe leverages the power of artificial intelligence, quantum
        computing, and generative AI to redefine CCTV crime detection. Our
        platform ensures proactive safety, real-time alerts, and enhanced public
        confidence through state-of-the-art technology.
      </p>
    </div>
  </div>
);

const OverviewPage = () => {
  const [stats, setStats] = useState(dashboardStats);
  const [isEditing, setIsEditing] = useState(false);

  const handleRefresh = async () => {
    try {
      await fetch("http://localhost:5000/api/dashboard/fetch-stats", {
        method: "GET",
      });
      console.log("Stats refreshed");
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing stats:", error);
    }
  };

  const handleCountChange = (index, type) => {
    const updatedStats = [...stats];
    const change = type === "increase" ? 1 : -1;
    updatedStats[index].value += change;
    setStats(updatedStats);
  };

  const saveUpdatesToDB = async () => {
    try {
      await fetch("http://localhost:5000/api/dashboard/update-stats", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stats),
      });
      console.log("Stats updated in the database");
    } catch (error) {
      console.error("Error updating stats:", error);
    }
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      saveUpdatesToDB();
    }
  };

  return (
    <div className="flex-1 overflow-auto relative z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 min-h-screen">
      
      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        <ContentWithLottie />
        {/* <Header title="ZenSafe Dashboard" /> */}

        {/* Stats Section */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12 mt-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {stats.map((stat, index) => {
            const icons = {
              "Total Alerts Today": Zap,
              "Resolved Alerts": CheckCircle,
              "Pending Alerts": AlertTriangle,
              "Critical Alerts": AlertOctagon,
              "Total Cameras": Cctv,
              "Active Cameras": Camera,
              "Offline Cameras": CameraOff,
              "Cameras with Active Alerts": AlertCircle,
            };

            const staticColors = {
              "Total Alerts Today": "#6366F1",
              "Resolved Alerts": "#90EE90",
              "Pending Alerts": "#FF0000",
              "Critical Alerts": "#FF6961",
              "Total Cameras": "#6366F1",
              "Active Cameras": "#90EE90",
              "Offline Cameras": "#FF0000",
              "Cameras with Active Alerts": "#FF6961",
            };

            const Icon = icons[stat.name] || Zap;
            const color = staticColors[stat.name] || "#6366F1";

            return (
              <motion.div
                key={index}
                className="relative bg-gradient-to-br from-gray-700 to-gray-900 p-5 rounded-lg shadow-lg hover:shadow-xl transform transition-transform hover:scale-105"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <StatCard
                  name={stat.name}
                  icon={Icon}
                  value={stat.value}
                  color={color}
                />
                {isEditing && (
                  <div className="absolute top-0 right-0 flex space-x-2">
                    <motion.button
                      onClick={() => handleCountChange(index, "increase")}
                      className="bg-blue-500 text-white p-2 rounded-full shadow-md"
                      whileTap={{ scale: 1.1 }}
                    >
                      <PlusCircle size={20} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleCountChange(index, "decrease")}
                      className="bg-red-500 text-white p-2 rounded-full shadow-md"
                      whileTap={{ scale: 1.1 }}
                    >
                      <MinusCircle size={20} />
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AlertOverviewChart />
          <CategoryDistributionChart />
          <SalesChannelChart />
        </div>
      </main>

      {/* Action Buttons */}
      <motion.button
        onClick={handleRefresh}
        className="fixed bottom-8 right-8 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <FiRefreshCcw size={24} />
      </motion.button>

      <motion.button
        onClick={toggleEditMode}
        className="fixed bottom-24 right-8 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center transition duration-300"
        whileHover={{ scale: 1.1 }}
      >
        <FaEdit size={24} />
      </motion.button>
    </div>
  );
};

export default OverviewPage;
