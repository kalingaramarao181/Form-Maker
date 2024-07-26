import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./index.css";
import { FaWpforms } from "react-icons/fa";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import baseUrl from "../config";
import Popup from "reactjs-popup";
import { QRCode } from "react-qrcode-logo";

const Forms = (props) => {
  const { history } = props;
  const [openQR, setOpenQR] = useState(false);
  const [forms, setForms] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [formLink, setFormLink] = useState("");
  const qrCodeCanvasRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${baseUrl}all-forms`)
      .then((res) => {
        setForms(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const searchedData = forms.filter((form) =>
    form.formname.toLocaleLowerCase().includes(searchValue)
  );

  const onClickFormTab = (formId) => {
    localStorage.setItem("formId", formId);
    history.push("/form/" + formId);
  };

  const onClickAddNew = () => {
    localStorage.setItem("sidebarButtonStatus", "CreateForm")
    window.location.reload()
  }

  const downloadQRCode = () => {
    const canvas = qrCodeCanvasRef.current;
    const context = canvas.getContext('2d');
    const qrCodeSize = 128; // Size of the QR code

    // Set the background color to white
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the QR code on top
    const qrCodeCanvas = document.getElementById('qrCode').querySelector('canvas');

    // Calculate the position to center the QR code
    const qrCodeX = (canvas.width - qrCodeSize) / 2;
    const qrCodeY = (canvas.height - qrCodeSize) / 2;

    context.drawImage(qrCodeCanvas, qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    // Add heading
    context.font = '24px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText('Scan Reco Form QR Code', canvas.width / 2, qrCodeY - 30);


    // Add description
    context.font = '18px Arial';
    context.fillText('Use your phone to scan the QR code', canvas.width / 2, qrCodeY + qrCodeSize + 30);

    // Create download link
    const img = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = img;
    link.download = "qr_code.png";
    link.click();
  };

  const onClickFormShare = (formid) => {
    setFormLink(`${window.location.protocol}//${window.location.host}/form/${formid}`);
    setOpenQR(true);
  };

  const isOpenQRPopup = () => {
    return (
      <Popup
        open={openQR}
        onClose={() => setOpenQR(false)}
        closeOnDocumentClick
        contentStyle={{
          width: "30vw",
          padding: "3.5vw",
          borderRadius: "10px",
          boxShadow:
            "0 6px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
          transition: "opacity 0.5s ease-in-out",
          backgroundColor: "white",
          height: "30vh",
          overflowY: "auto",
          scrollbarWidth: "none", /* Firefox */
        }}
      >
        {(close) => (
            <div className="share-popup-view">
                <h1 className="qr-heading">Download or Scan This QR</h1>
              <div id="qrCode">
                <QRCode value={formLink} size={128} bgColor="white" fgColor="black" />
              </div>
              <canvas ref={qrCodeCanvasRef} width={400} height={400} style={{ display: "none" }} />
              <a className="qr-link" href={formLink}>Form Link</a>
              <div className="success-button-container">
                <button className="download-qr-button" onClick={downloadQRCode} >Download QR Code</button>
                <button className="ok-button" onClick={() => setOpenQR(false)}>Ok</button>
              </div>
            </div>
        )}
      </Popup>
    );
  };

  return (
    <>
      <div className="forms-table-view-main-container">
        <h1 className="forms-table-heading">Forms:</h1>
        <input
          onChange={(e) => setSearchValue(e.target.value.toLocaleLowerCase())}
          type="search"
          placeholder="Search your Form"
          className="forms-search-input"
        />
        <div
          className="forms-table-view-container"
          style={
            searchedData.length === 0
              ? { flexDirection: "column" }
              : { flexDirection: "row" }
          }
        >
          {searchedData.length === 0 ? (
            <p className="forms-table-search-data-err">No Data Found</p>
          ) : (
            <>
              {searchedData.map((eachForm) => {
                return (
                  <div type="button" className="forms-table-view-button">
                    {eachForm.formname}
                    <FaWpforms className="forms-table-view-button-icon" />
                    <div className="open-share-button-container">
                      <button
                        onClick={() => onClickFormTab(eachForm.formid)}
                        type="button"
                        className="open-button"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => onClickFormShare(eachForm.formid)}
                        type="button"
                        className="share-button"
                      >
                        Share
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
            <button onClick={onClickAddNew} type="button" className="forms-table-view-button-add">
              <MdOutlineLibraryAdd className="forms-table-view-button-add-icon" />
              ADD New
            </button>
        </div>
      </div>
      {isOpenQRPopup()}
    </>
  );
};

export default withRouter(Forms);
