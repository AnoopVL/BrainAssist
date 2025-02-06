import axios from "axios"; // Importing axios for making HTTP requests
import { useEffect, useState } from "react"; // Importing useEffect and useState from React
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

interface ContentItem {
  _id: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  tags: string[];
}

// Custom hook to manage and fetch content data
export function useContent() {
  // State to hold the fetched content
  // const [contents, setContents] = useState([]);
  const [contents, setContents] = useState<ContentItem[]>([]);

  // Function to refresh and fetch content from the backend
  function refresh() {
    axios
      .get(`${BACKEND_URL}/api/v1/content`, {
        // Making GET request to the backend API
        headers: {
          authorization: localStorage.getItem("token"), // Including the token from localStorage for authentication
        },
      })

      .then((response) => {
        console.log("API Response:", response.data);
        if (Array.isArray(response.data)) {
          setContents(response.data as ContentItem[]); // ✅ Type assertion
        } else {
          console.error("Unexpected API response structure:", response.data);
          setContents([]);
        }
      })

      .catch((error) => {
        // Handle any error that occurs during the request (optional)
        console.error("Error fetching content:", error);
      });
  }

  // useEffect hook to perform actions on component mount and set an interval for periodic refresh
  useEffect(() => {
    refresh(); // Initial fetch when the component mounts

    // Set an interval to refresh content every 10 seconds
    let interval = setInterval(() => {
      refresh();
    }, 10 * 1000); // 10 seconds interval

    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval); // Clears the interval when the component is removed from the DOM
    };
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Returning the contents and refresh function to be used in components that consume this hook
  return { contents, refresh };
}
