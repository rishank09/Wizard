import React, { useEffect, useState } from 'react';
import { Gem, Sparkles } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import toast from 'react-hot-toast';
import sky from '../assets/sky.png';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
//  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  //  setLoading(false);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div
      className="h-full overflow-y-scroll text-gray-300"
      style={{
        backgroundImage: `url(${sky})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay & Main Content Wrapper */}
      <div className="p-6 sm:p-10 bg-[#0f172a]/60 min-h-screen">
        {/* ====== Stats Cards ====== */}
        <div className="flex justify-start gap-6 flex-wrap mb-10">
          {/* Total Creations Card */}
          <div
            className="flex justify-between items-center w-72 p-5 px-6 
            bg-white/10 backdrop-blur-md rounded-xl 
            transition-all duration-300 cursor-pointer 
            hover:bg-gray-700 active:shadow-[0_0_12px_#a855f7]"
          >
            <div>
              <p className="text-sm text-gray-200">Total Creations</p>
              <h2 className="text-2xl font-semibold text-white mt-1">{creations.length}</h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex justify-center items-center">
              <Sparkles className="w-5 text-white" />
            </div>
          </div>

          {/* Active Plan Card */}
          <div
            className="flex justify-between items-center w-72 p-5 px-6 
            bg-white/10 backdrop-blur-md rounded-xl 
            transition-all duration-300 cursor-pointer 
            hover:bg-gray-700 active:shadow-[0_0_12px_#a855f7]"
          >
            <div>
              <p className="text-sm text-gray-200">Active Plan</p>
              <h2 className="text-2xl font-semibold text-white mt-1">
                <Protect plan="premium" fallback="Free">
                  Premium
                </Protect>
              </h2>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] flex justify-center items-center">
              <Gem className="w-5 text-white" />
            </div>
          </div>
        </div>

        {/* ====== Recent Creations ====== */}
        <div>
          <p className="text-lg font-semibold text-white mb-4">Recent Creations</p>
          <div className="space-y-3">
            {creations.map((item) => (
              <div
                key={item.id}
                className="bg-white/10 backdrop-blur-md rounded-lg p-4 
                transition-all duration-300 cursor-pointer 
                hover:bg-gray-800 "
              >
                <CreationItem item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
