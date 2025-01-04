import React, { useState, useEffect } from "react";
import axios from "../utils/axios";
import Post from '../components/Post';
import Sidebar from '../components/Sidebar';
import NavigationBar from '../components/NavigationBar';
import useAuth from "../hooks/useAuth";

export default function Home() {
  const [data, setData] = useState([]);
  const [nextUrl, setNextUrl] = useState('posts/');
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { auth } = useAuth();

  async function fetchData(url) {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      let response;

      if (auth?.accessToken) {
        response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${auth?.accessToken}`
          }
        });
        console.log('have access token')
      } else {
        response = await axios.get(url);
        console.log('dont have access token')
      }
      console.log(response.data.results)
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

        {/* main block */}
        <div className="flex flex-grow p-1">
          <div className="scrollable-container bg-[#1c1e21] rounded-3xl p-4 mx-auto text-center overflow-y-auto no-scrollbar pb-12 border border-[#323232] 
                w-[400px] max-w-2sm md:w-sm max-h-[88vh]">
            <Post data={data} setData={setData} />
            {(!hasMore == 0 || data == []) && <p>No posts available</p>}
            {loading && <p>Loading...</p>}
          </div>

        </div>


      </div>
    </div>
  );
}
