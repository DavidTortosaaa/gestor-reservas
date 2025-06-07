type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export default function InputField({
  type = "text",
  className = "",
  ...props
}: InputFieldProps) {
  return (
    <input
      type={type}
      {...props}
      className={`w-full border p-2 rounded text-black ${className}`}
    />
  )
}
  