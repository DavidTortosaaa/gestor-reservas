export default function FormWrapper({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <div className="max-w-3xl mx-auto mt-10 bg-white p-8 rounded shadow text-black">
        <h1 className="text-2xl font-bold mb-6">{title}</h1>
        {children}
      </div>
    );
  }
  