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
                const token = localStorage.getItem("token"); // Auth token check karein
                const res = await axios.get("http://localhost:5000/api/users/history", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setScans(res.data);
                setLoading(false);
            } catch (err) {
                console.error("History fetch error:", err);
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    if (loading) return <div className="text-center p-10">Loading History...</div>;

    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User Scan History</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600">Website URL</th>
                            <th className="p-4 font-semibold text-gray-600">Scan Type</th>
                            <th className="p-4 font-semibold text-gray-600">Results Found</th>
                            <th className="p-4 font-semibold text-gray-600">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {scans.length > 0 ? scans.map((scan) => (
                            <tr key={scan._id} className="border-b hover:bg-gray-50 transition">
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(scan.createdAt).toLocaleDateString('en-GB')}
                                </td>
                                <td className="p-4 font-medium text-blue-600 truncate max-w-xs">
                                    {scan.website}
                                </td>
                                <td className="p-4 text-sm text-gray-700">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${scan.type === 'broken' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                                        {scan.type === 'broken' ? 'Broken Links' : 'Orphan Pages'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-700 font-bold">
                                    {scan.results.length} Issues
                                </td>
                                <td className="p-4">
                                    <button 
                                 onClick={() => router.push(`/history/${scan._id}`)} // 🟢 Ye naye page par le jayega, naye tab mein nahi
                                className="bg-indigo-600 text-white px-4 py-1 rounded text-sm hover:bg-indigo-700 font-bold transition-all"
                                >
                                View Full Report
                                </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-400">Abhi tak koi scan nahi kiya gaya hai.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default History;