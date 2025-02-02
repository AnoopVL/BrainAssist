import { ReactElement, useState } from "react";

// Defining the properties that the Button component can accept
interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
}

// Mapping button variants to their respective CSS classes
const variantClasses = {
  primary: "bg-purple-600 text-white", // Primary styles
  secondary: "bg-purple-200 text-purple-600", // Secondary styles
};

// Default CSS classes for all buttons
const defaultStyles =
  "px-4 py-2 rounded-md font-light flex items-center transition duration-300"; // Smooth transition on hover

// The Button functional component
export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
}: ButtonProps) {
  // State to track hover status
  const [isHovered, setIsHovered] = useState(false);

  // Determine the current variant based on hover state
  const currentVariant = isHovered
    ? variant === "primary"
      ? "secondary"
      : "primary"
    : variant;

  return (
    <button
      onClick={onClick}
      className={`${variantClasses[currentVariant]} 
        ${defaultStyles} 
        ${fullWidth ? "w-full flex justify-center items-center" : ""} 
        ${loading ? "opacity-45 cursor-not-allowed" : ""}`}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Container for optional start icon */}
      {startIcon && <div className="pr-2">{startIcon}</div>}
      {/* Button text */}
      {text}
    </button>
  );
}
