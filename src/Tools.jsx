/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unknown-property */
// src/App.js
import { useState, useRef } from "react";
import PptxGenJS from "pptxgenjs";
import * as XLSX from "xlsx";
import { Input, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import JSConfetti from "js-confetti";
import videoSrc from "/corgi.mp4";

const Tool = () => {
  const [folders, setFolders] = useState([]);
  const [excels, setExcels] = useState([]);
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const fileInputRef = useRef(null);
  const excelInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra xem chuỗi có chứa mẫu " (" hay không
  function checkString(str) {
    if (str.includes(" (")) {
      return true;
    } else {
      return false;
    }
  }

  // Kiểm tra cName
  function checkCName(str) {
    if (str.startsWith("TP ") || str.startsWith("TP.")) {
      return str.replace("TP ", "TP.").replace(/\(|\)/g, "");
    } else if (str.startsWith("H. ") || str.startsWith("H.")) {
      return str
        .replace("H. ", "Huyện ")
        .replace("H.", "Huyện ")
        .replace(/\(|\)/g, "");
    } else {
      return str.replace(/\(|\)/g, "");
    }
  }

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

  // Hàm đọc file excel
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
      // Process jsonData as needed - Lấy ra mảng và set state
      setExcels(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };

  // Confetti
  const Confetti = () => {
    const jsConfetti = new JSConfetti();
    return jsConfetti.addConfetti();
  };

  // Lọc dữ liệu excel theo tên của folder
  const filterExcel = (name) => {
    const checkName = checkString(name)
      ? name.toLowerCase().match(/(.*)\s+\(.*/)[1]
      : name.toLowerCase();
    const arrs = excels.filter(
      (x) => x["Tên Đại Lý"].toLowerCase() === checkName
    );
    const data = arrs.find((y) => y["Tên Đại Lý"].toLowerCase() === checkName);
    const dl = data["Tên Đại Lý"] ? data["Tên Đại Lý"] : "";
    const qh = data["Quận - Huyện"] ? data["Quận - Huyện"] : "";
    const gc = data["GHI CHÚ"] ? data["GHI CHÚ"] : "";
    return { dl, qh, gc };
  };

  // Hàm tạo file PPT từ folder và ảnh
  const createPPT = () => {
    try {
      if (city === "" || region === "") {
        alert("Nhập đầy đủ dô coai.");
      } else {
        if (folders.length === 0) {
          alert("Chưa có bỏ folder dô mà làm cái gì, giỡn mặt hả.");
        } else {
          setIsLoading(true);
          const pptx = new PptxGenJS();
          const promises = [];
          folders.forEach((folder) => {
            const infoOnExcel = filterExcel(folder.name);
            // Tạo slide mới và đặ tên từ tên thư mục
            const slide = pptx.addSlide();
            slide.addText(
              `${region} – ${city} – ${checkCName(infoOnExcel.qh)} - ĐL ` +
                folder.name,
              {
                x: 1,
                y: 0.5,
                w: "90%",
                h: "10%",
                color: "#D41C4C",
                bold: true,
                fontSize: 22.6,
                fontFace: "Segoe UI",
              }
            );

            slide.addText(`${infoOnExcel.gc}`, {
              x: 1,
              y: 1.5,
              w: "50%",
              h: "1%",
              color: "#333",
              fontSize: 16,
            });

            const fileCount = folder.files.length;
            let imgWidth, imgHeight, rows, cols, startY;

            // if (fileCount < 3) {
            //   imgWidth = 3.5;
            //   imgHeight = 2.625;
            //   rows = 1;
            //   cols = fileCount;
            // } else if (fileCount === 4) {
            //   imgWidth = 2.5;
            //   imgHeight = 1.875;
            //   rows = 2;
            //   cols = 2;
            // } else if (fileCount === 5) {
            //   imgWidth = 2.5;
            //   imgHeight = 1.875;
            //   rows = 2;
            //   cols = 3;
            // } else {
            //   imgWidth = 2.5;
            //   imgHeight = 1.875;
            //   rows = 2;
            //   cols = 3;
            // }

            if (fileCount < 3) {
              imgWidth = 3.5;
              imgHeight = 2.625;
              rows = 1;
              cols = fileCount;
              startY = 0.5 + 30 / 72 + 70 / 96; // cách 10px từ text trên slide
            } else if (fileCount === 3) {
              imgWidth = 3.0;
              imgHeight = 2.25;
              rows = 1;
              cols = fileCount;
              startY = 0.5 + 30 / 72 + 70 / 96; // cách 10px từ text trên slide
            } else if (fileCount === 4) {
              imgWidth = 2.5;
              imgHeight = 1.875;
              rows = 2;
              cols = 2;
              startY = 1; // giữ nguyên vị trí
            } else if (fileCount === 5) {
              imgWidth = 2.5;
              imgHeight = 1.875;
              rows = 2;
              cols = 3;
              startY = 1;
            } else {
              imgWidth = 2.5;
              imgHeight = 1.875;
              rows = 2;
              cols = 3;
              startY = 1;
            }

            const totalWidth = cols * imgWidth + (cols - 1) * 0.2;
            const startX = (10 - totalWidth) / 2; // Căn giữa slide với chiều rộng slide là 10 inch
            //startY = 1;

            folder.files.forEach((file, index) => {
              const reader = new FileReader();
              const promise = new Promise((resolve) => {
                reader.onload = (e) => {
                  const col = index % cols;
                  const row = Math.floor(index / cols);
                  const x = startX + col * (imgWidth + 0.2);
                  const y = startY + row * (imgHeight + 0.2);
                  slide.addImage({
                    data: e.target.result,
                    x,
                    y,
                    w: imgWidth,
                    h: imgHeight,
                  });
                  resolve();
                };
                reader.readAsDataURL(file);
              });
              promises.push(promise);
            });
          });

          Promise.all(promises).then(() => {
            setTimeout(() => {
              pptx.writeFile({ fileName: `${region}_${city}.pptx` });
              resetState();
              setIsLoading(false);
            }, 2000);
            setTimeout(() => {
              Confetti();
            }, 3000);
          });
        }
      }
    } catch (e) {
      setTimeout(() => {
        setIsLoading(false);
        alert("Có lỗi gòi. Kiểm tra file lại đi cưng.");
        console.log(e);
      }, 2000);
    }
  };

  // Hàm reset State
  const resetState = () => {
    fileInputRef.current.value = "";
    excelInputRef.current.value = "";
    setFolders([]);
  };

  return (
    <div className="tools">
      <h1>
        <span>FB88</span> Nhà Cái Đến Từ Việt Nam
      </h1>
      {/* <div className="corgi">
        <video
          className="pointer-events-none"
          playsInline
          preload="none"
          muted
          autoPlay
          loop
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div> */}
      <div className="info" style={{ height: "auto" }}>
        <Text className="info__text" mb="8px">
          Tên vùng
          <span style={{ color: "red" }}>*</span>
        </Text>
        <Input
          onChange={(e) => setRegion(e.target.value)}
          className="input__info"
          placeholder="Nhập tên vùng"
        />
        <Text className="info__text" mb="8px">
          Tên tỉnh
          <span style={{ color: "red" }}>*</span>
        </Text>
        <Input
          onChange={(e) => setCity(e.target.value)}
          className="input__info"
          placeholder="Nhập tên tỉnh"
        />
        <div className="tools_inside">
          <Text className="info__text" mb="8px">
            Folder
            <span style={{ color: "red" }}>*</span>
          </Text>
          <input
            type="file"
            id="folderUpload"
            webkitdirectory="true"
            directory="true"
            ref={fileInputRef}
            onChange={handleFolderUpload}
          />
          <Text className="info__text" mb="8px">
            Excel
            <span style={{ color: "red" }}>*</span>
          </Text>
          <input
            placeholder="Excel"
            type="file"
            id="excelUpload"
            accept=".xlsx, .xls"
            ref={excelInputRef}
            onChange={handleExcelUpload}
          />
          <Button
            isLoading={isLoading}
            onClick={createPPT}
            colorScheme="teal"
            size="lg"
          >
            Tạo PowerPoint
          </Button>
        </div>
        <Link
          style={{
            paddingTop: "8px",
            float: "left",
            fontWeight: "800",
            color: "blue",
            textDecoration: "underline",
          }}
          to="/test"
        >
          Kiểm tra tên đại lí
        </Link>
      </div>
    </div>
  );
};

export default Tool;
