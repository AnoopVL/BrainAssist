// Defining the InputProps interface to specify the types for the props
interface InputProps {
  placeholder: string; // Placeholder text for the input field
  reference?: any; // Optional reference to the input field for accessing its value or methods
  type?: "text" | "password"; // Input type to handle both text and password fields
}

// Input component definition
export function Input({ placeholder, reference, type = "text" }: InputProps) {
  return (
    <div>
      {/* Input field with the provided placeholder, reference, and type */}
      <input
        ref={reference} // Attaching the reference to the input field
        placeholder={placeholder} // Setting the placeholder text for the input field
        type={type} // Using the provided type (defaults to "text")
        className="px-4 py-2 border rounded m-2" // Tailwind CSS classes for styling the input field
      />
    </div>
  );
}
