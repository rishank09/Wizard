import { useAuth, useUser } from '@clerk/clerk-react';
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        toast.success(data.message);
        await fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  return !loading ? (
    <div className="flex-1 flex flex-col gap-4 p-6 bg-[#0e1525] min-h-screen">
      <h2 className="text-xl font-semibold text-gray-100 mb-2">Community Creations</h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {creations.length > 0 ? (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group rounded-xl overflow-hidden border border-[#2b3750] bg-[#1a2235] shadow-md hover:shadow-lg transition-all duration-300"
            >
              <img
                src={creation.content}
                alt=""
                className="w-full h-64 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 rounded-xl">
                <p className="text-sm text-gray-300 mb-2 line-clamp-2">{creation.prompt}</p>
                <div className="flex justify-end items-center gap-2">
                  <p className="text-gray-300">{creation.likes.length}</p>
                  <Heart
                    onClick={() => imageLikeToggle(creation.id)}
                    className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                      creation.likes.includes(user.id)
                        ? 'fill-[#F45B69] text-[#F45B69]'
                        : 'text-gray-200'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center col-span-full py-10">
            No creations published yet.
          </p>
        )}
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-full bg-[#0e1525]">
      <span className="w-10 h-10 my-1 rounded-full border-4 border-[#00AD25] border-t-transparent animate-spin"></span>
    </div>
  );
};

export default Community;
