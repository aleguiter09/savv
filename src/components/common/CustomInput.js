export default function Input({ label, type, id, value, setValue }) {
  return (
    <div className="flex flex-col">
      <label htmlFor="id" className="font-medium text-sm mb-2">
        {label}
      </label>
      <input
        id={id}
        name={type}
        type={type}
        value={value}
        onChange={(e) => setValue(e.currentTarget.value)}
        className="rounded-md p-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
      />
    </div>
  );
}
