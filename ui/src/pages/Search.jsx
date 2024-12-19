import React, { useState, useEffect } from 'react';
import NavigationBar from '../components/NavigationBar';
import Sidebar from '../components/Sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedResults = localStorage.getItem('searchResults');
    const storedQuery = localStorage.getItem('searchQuery');

    if (storedResults && storedQuery) {
      setSearchResults(JSON.parse(storedResults));
      setSearchQuery(JSON.parse(storedQuery));
      console.log('Loaded stored data:', { storedQuery, storedResults });
    }
  }, []);

  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchSearchResults(searchQuery);
    }, 500);

    return () => clearTimeout(timeoutId); // Cleanup on component unmount or query change
  }, [searchQuery]);

  const fetchSearchResults = async (query) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/search/', { 'search_query': query });
      setSearchResults(response.data);
      localStorage.setItem('searchQuery', JSON.stringify(query));
      localStorage.setItem('searchResults', JSON.stringify(response.data));
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <NavigationBar />

      <div className="flex flex-grow overflow-hidden">
        <div className="sm:w-16 w-full sm:h-full h-16 sm:relative absolute bottom-0 left-0 sm:flex flex-col items-center sm:space-y-5 space-x-7 sm:space-x-0 bg-[#0A0A0A] text-white shadow-lg">
          <Sidebar />
        </div>

        <div className="text-black mb-16 mx-auto mt-1">
          <form>
            <input
              className="px-4 font-medium py-2 rounded-sm"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search users"
            />
            {loading && <p className="text-white">Loading...</p>}

            <div className="flex flex-grow">
              <ul className="text-white overflow-y-scroll no-scrollbar w-full rounded-sm">
                {searchResults.length > 0 ? (
                  searchResults.map((user) => (
                    <Link to={`/user/${user.username}`} key={user.username}> {/* Ensure 'username' is unique */}
                      <li className="border p-1 border-gray-600 rounded-sm px-4 py-1">
                        {user.username}
                      </li>
                    </Link>
                  ))
                ) : (
                  <li className="border p-1 border-gray-600">No users found</li>
                )}
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Search;
