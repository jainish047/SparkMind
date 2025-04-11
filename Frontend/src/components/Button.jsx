export default function Button(props) {
    return (
      <button
        type={props.type || ""}
        className="bg-gray-500 rounded w-full p-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400 hover:bg-gray-600 active:bg-gray-700 text-white"
      >
        {props.value}
      </button>
    );
  }