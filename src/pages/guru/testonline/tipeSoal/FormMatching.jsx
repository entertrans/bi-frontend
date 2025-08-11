import React from "react";

const FormMatching = ({ pairs, setPairs }) => {
  const handleLeftChange = (index, value) => {
    const newPairs = [...pairs];
    newPairs[index].left = value;
    setPairs(newPairs);
  };

  const handleRightChange = (index, value) => {
    const newPairs = [...pairs];
    newPairs[index].right = value;
    setPairs(newPairs);
  };

  const addPair = () => {
    setPairs([...pairs, { left: "", right: "" }]);
  };

  const removePair = (index) => {
    if (pairs.length <= 1) return;
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
  };

  return (
    <div>
      <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
        Pasangan yang Dicocokkan
      </label>
      {pairs.map((pair, i) => (
        <div key={i} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder="Kiri"
            value={pair.left}
            onChange={(e) => handleLeftChange(i, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <span className="font-bold">=</span>
          <input
            type="text"
            placeholder="Kanan"
            value={pair.right}
            onChange={(e) => handleRightChange(i, e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="button"
            onClick={() => removePair(i)}
            className="text-red-600 hover:text-red-800 font-bold px-2"
            aria-label="Hapus pasangan"
          >
            &times;
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addPair}
        className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Tambah Pasangan
      </button>
    </div>
  );
};

export default FormMatching;
