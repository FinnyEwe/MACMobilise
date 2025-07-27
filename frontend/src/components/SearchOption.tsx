export default function SearchOption({ option, onClick }: { option: string, onClick: ()=>void }) {

  return (
    <div className="hover:bg-gray-100 cursor-pointer" onClick={onClick}>
      <p className="p-2">{option}</p>
      <hr />
    </div>
  );
}
