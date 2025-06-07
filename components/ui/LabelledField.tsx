type Props = {
    label: string;
    children: React.ReactNode;
  };
  
  export default function LabelledField({ label, children }: Props) {
    return (
      <label className="block text-sm text-black">
        {label}
        <div className="mt-1">{children}</div>
      </label>
    );
  }
  