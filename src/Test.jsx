/* eslint-disable react/no-unknown-property */
import { useState } from "react";
import * as XLSX from "xlsx";
import { Button, Text } from "@chakra-ui/react";

const Test = () => {
  const [dataExcels, setDataExcels] = useState([]);
  const [folders, setFolders] = useState([]);
  const [uniqueNames, setUniqueNames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  function checkString(str) {
    // Kiểm tra xem chuỗi có chứa mẫu " (" hay không
    if (str.includes(" (")) {
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
      setDataExcels(jsonData);
      // Match folder files with Excel data
    };
    reader.readAsArrayBuffer(file);
  };

  // Hàm xử lý khi người dùng chọn thư mục chứa ảnh
  const handleFolderUpload = (event) => {
    const files = event.target.files;
    const folderMap = {};
    Array.from(files).forEach((file) => {
      const folderName = file.webkitRelativePath.split("/")[1];
      if (!folderMap[folderName]) {
        folderMap[folderName] = [];
      }
      folderMap[folderName].push(file);
    });
    setFolders(
      Object.keys(folderMap).map((folderName) => ({
        name: folderName,
        files: folderMap[folderName],
      }))
    );
  };

  // Lọc dữ liệu excel theo tên của folder
  const filterExcel = (name) => {
    try {
      setIsLoading(true);
      const checkName = checkString(name)
        ? name.toLowerCase().match(/(.*)\s+\(.*/)[1]
        : name.toLowerCase();
      const arrs = dataExcels.filter(
        (x) => x["Tên Đại Lý"]?.toLowerCase() === checkName
      );

      if (arrs.length === 0) {
        setUniqueNames((prevLogs) => [
          ...prevLogs,
          `Không tìm thấy kết quả phù hợp với tên: ${name}`,
        ]);
        return { dl: "", qh: "", gc: "" };
      } else {
        setSuccess("Tên đại lý đều đúng.");
      }

      const data = arrs.find(
        (y) => y["Tên Đại Lý"]?.toLowerCase() === checkName
      );

      if (!data) {
        alert(`Không tìm thấy data phù hợp với tên: ${name}`);
        return { dl: "", qh: "", gc: "" };
      }

      const dl = data["Tên Đại Lý"] || "";
      const qh = data["Quận - Huyện"] || "";
      const gc = data["GHI CHÚ"] || "";
      setIsLoading(false);
      return { dl, qh, gc };
    } catch (error) {
      setIsLoading(false);
      console.log(`Lỗi khi sử lý tên: ${name}, lỗi: ${error.message}`);
      return { dl: "", qh: "", gc: "" };
    }
  };

  const readData = () => {
    if (folders.length === 0 || dataExcels.length === 0) {
      alert("Chưa có bỏ folder, excel dô cà.");
    } else {
      folders.forEach((folder) => {
        filterExcel(folder.name);
      });
    }
  };

  return (
    <div className="tools">
      <h1>Kiểm tra tên đại lý</h1>
      <div className="test">
        <Text className="info__text" mb="8px">
          Úp Folder
          <span style={{ color: "red" }}>*</span>
        </Text>
        <input
          type="file"
          id="folderUpload"
          webkitdirectory="true"
          directory="true"
          onChange={handleFolderUpload}
        />
        <br />
        <Text className="info__text" mb="8px">
          Úp Excel
          <span style={{ color: "red" }}>*</span>
        </Text>
        <input
          type="file"
          accept=".xlsx, .xls"
          id="excelUpload"
          onChange={handleExcelUpload}
        />
      </div>
      <Button
        isLoading={isLoading}
        onClick={readData}
        colorScheme="teal"
        size="lg"
      >
        Kiểm tra
      </Button>
      <ul>
        {uniqueNames.map((msg, index) => (
          <li style={{ listStyle: "none" }} key={index}>
            {msg}
          </li>
        ))}
      </ul>
      {success && <h3>{success}</h3>}
    </div>
  );
};

export default Test;
