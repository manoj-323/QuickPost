import React, { useState, useEffect } from "react";
import axios from 'axios';
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import NavigationBar from '../components/NavigationBar';

export default function Home() {
  const [data, setData] = useState([]);
  const [nextUrl, setNextUrl] = useState('http://127.0.0.1:8000/feed/');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  async function fetchData(url) {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await axios.get(url);
      setNextUrl(response.data.next);
      if (!nextUrl) {
        setHasMore(false);
      }

      if (!response.data.results) {
        return
      }
      setData((prevData) => {
        const existingIds = new Set(prevData.map(item => item.id));
        const newDataWithoutDuplicates = response.data.results.filter(item => !existingIds.has(item.id));
        return [...prevData, ...newDataWithoutDuplicates];
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver((param) => {
      if (param[0].isIntersecting) {
        observer.unobserve(lastPost);
        fetchData(nextUrl);
      }
    }, {
      root: document.querySelector('.scrollable-container'),
      rootMargin: '0px',
      threshold: 1.0,
    });

    const lastPost = document.querySelector('.post:last-child');
    if (!lastPost) {
      return
    }
    observer.observe(lastPost);
  }, [data]);

  useEffect(() => {
    fetchData(nextUrl);
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />

      <div className="flex flex-grow overflow-hidden">
        <div className="sm:w-16 w-full sm:h-full h-16 sm:relative absolute bottom-0 left-0 sm:flex flex-col items-center sm:space-y-5 space-x-7 sm:space-x-0 bg-[#0A0A0A] text-white shadow-lg">
          <Sidebar />
        </div>

        <div className="flex flex-grow p-1">
          <div className="scrollable-container bg-[#1c1e21] rounded-3xl p-1 mx-auto text-center overflow-y-auto no-scrollbar pb-12 border border-[#323232] 
                          w-[90%] md:w-2/3 max-h-[88vh]">
            <Post data={data} />
            {!hasMore && <p>No more posts available</p>}
            {loading && <p>Loading...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
