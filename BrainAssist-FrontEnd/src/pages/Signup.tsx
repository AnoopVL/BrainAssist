import { useRef } from "react"; // Importing useRef to create references for the input fields
import { Button } from "../components/ui/Button"; // Importing Button component for the submit button
import { Input } from "../components/ui/Input"; // Importing Input component for form fields
import axios from "axios"; // Importing axios for making HTTP requests
import { useNavigate } from "react-router-dom"; // Importing useNavigate hook for routing
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL as string;

// Signup component to handle user registration
export function Signup() {
  // References for the username and password input fields
  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();

  // useNavigate hook for navigating to different routes
  const navigate = useNavigate();

  // signup function to handle user registration
  async function signup() {
    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;

    console.log("Backend URL:", BACKEND_URL);

    try {
      const apiUrl = `${BACKEND_URL}/api/v1/signup`;
      console.log("API URL:", apiUrl);

      const response = await axios.post(
        apiUrl,
        { username, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup response:", response.data);
      navigate("/signin");
      alert("You have signed up!");
    } catch (error) {
      console.error("Signup error:", error);
      if ((error as any).isAxiosError) {
        console.error("Response data:", (error as any).response?.data);
        console.error("Response status:", (error as any).response?.status);
        console.error("Response headers:", (error as any).response?.headers);
      }
      alert("Signup failed. Please check the console for more details.");
    }
  }

  // JSX to render the signup form
  return (
    <div className="h-screen w-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white rounded-xl border min-w-48 p-8">
        {/* Input for username */}
        <Input reference={usernameRef} placeholder="Username" type="text" />
        {/* Input for password */}
        <Input reference={passwordRef} placeholder="Password" type="password" />
        {/* Submit button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={signup}
            loading={false}
            variant="primary"
            text="Signup"
            fullWidth={true}
          />
        </div>
        <div
          className="flex justify-center pt-4 cursor-pointer text-blue-600 hover:underline"
          onClick={() => navigate("/signin")}>
          Sign-in!
        </div>
      </div>
    </div>
  );
}
