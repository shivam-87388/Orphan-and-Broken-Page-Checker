'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'

const History = () => {
    const router = useRouter();
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const token = localStorage.getItem("token"); // Auth token check
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/users/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setScans(res.data);
                setLoading(false)
            } catch (err) {
                console.error("History fetch error:", err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center p-10">Loading History...</div>;

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
  <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-gray-800 font-['Nunito']">User Scan History</h1>
  
  <div className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
    {/* Desktop & Tablet Table (Hidden on Mobile) */}
    <div className="hidden sm:block overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[600px]">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="p-4 font-semibold text-gray-600 text-sm md:text-base">Date</th>
            <th className="p-4 font-semibold text-gray-600 text-sm md:text-base">Website URL</th>
            <th className="p-4 font-semibold text-gray-600 text-sm md:text-base">Scan Type</th>
            <th className="p-4 font-semibold text-gray-600 text-sm md:text-base">Results Found</th>
            <th className="p-4 font-semibold text-gray-600 text-sm md:text-base">Action</th>
          </tr>
        </thead>
        <tbody>
          {scans.length > 0 ? scans.map((scan) => (
            <tr key={scan._id} className="border-b hover:bg-gray-50 transition">
              <td className="p-4 text-sm text-gray-500">
                {new Date(scan.createdAt).toLocaleDateString('en-GB')}
              </td>
              <td className="p-4 font-medium text-blue-600 truncate max-w-xs md:max-w-sm">
                <a href={scan.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {scan.website}
                </a>
              </td>
              <td className="p-4 text-sm">
                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${scan.type === 'broken' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  {scan.type === 'broken' ? 'Broken Links' : 'Orphan Pages'}
                </span>
              </td>
              <td className="p-4 text-sm text-gray-700 font-bold">
                {scan.results?.length || 0} Issues
              </td>
              <td className="p-4">
                <button 
                  onClick={() => router.push(`/history/${scan._id}`)}
                  className="bg-indigo-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-indigo-700 font-semibold transition-all active:scale-95"
                >
                  View Report
                </button>
              </td>
            </tr>
          )) : (
            <tr>
              <td colSpan="5" className="p-10 text-center text-gray-400 italic">Abhi tak koi scan nahi kiya gaya hai.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Mobile Card Layout (Hidden on Desktop/Tablet) */}
    <div className="block sm:hidden divide-y divide-gray-200">
      {scans.length > 0 ? scans.map((scan) => (
        <div key={scan._id} className="p-4 hover:bg-gray-50 transition space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400 font-medium">
              {new Date(scan.createdAt).toLocaleDateString('en-GB')}
            </span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${scan.type === 'broken' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
              {scan.type === 'broken' ? 'Broken Links' : 'Orphan Pages'}
            </span>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-0.5">Website URL</p>
            <p className="font-semibold text-blue-600 text-sm truncate break-all">
              {scan.website}
            </p>
          </div>

          <div className="flex justify-between items-center pt-1">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Results</p>
              <p className="text-sm font-bold text-gray-800">{scan.results?.length || 0} Issues</p>
            </div>
            
            <button 
              onClick={() => router.push(`/history/${scan._id}`)}
              className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-indigo-700 active:scale-95 transition-all"
            >
              View Report
            </button>
          </div>
        </div>
      )) : (
        <div className="p-8 text-center text-gray-400 italic text-sm">
          Abhi tak koi scan nahi kiya gaya hai.
        </div>
      )}
    </div>
  </div>
</div>
    );
};

export default History;