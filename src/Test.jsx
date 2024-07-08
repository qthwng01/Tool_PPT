/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import * as XLSX from "xlsx";

const App = () => {
  const [matchedData, setMatchedData] = useState([]);
  const [name, setName] = useState("");

  function checkString(str) {
    // Kiểm tra xem chuỗi có chứa mẫu " (" hay không
        if (str.includes(' (')) {
            return true;
        } else {
            return false;
        }
    }

  const handleExcelUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      // Assuming sheet is the first one
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      // Convert sheet data to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      // Process jsonData as needed
      console.log(jsonData);
      setMatchedData(jsonData);
      // Match folder files with Excel data
    };
    reader.readAsArrayBuffer(file);
  };

  const readData = () => {
    const checkName = checkString(name) ? name.toLowerCase().match(/(.*)\s+\(.*/)[1] : name.toLocaleLowerCase()
    //console.log(checkName)
    const arr = matchedData.filter(x => x["Tên Đại Lý"].toLowerCase() === checkName);
    console.log(arr);
    const foundedData = arr.find(y => y["Tên Đại Lý"].toLowerCase() === checkName);
    console.log(foundedData["Tên Đại Lý"], foundedData["Quận - Huyện"], foundedData["GHI CHÚ"] ? foundedData["GHI CHÚ"] : '');
  };

  return (
    <div>
      <h2>Upload Excel and Folder</h2>
      <input type="file" onChange={handleExcelUpload} />
      <input
        type="text"
        onChange={(e) => setName(e.target.value)}
        placeholder="Nhập tên"
      />
      <button onClick={readData}>Read Data</button>
    </div>
  );
};

export default App;
