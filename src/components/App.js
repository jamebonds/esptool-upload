import React, { Fragment, useEffect, useState } from "react";
import { get, post } from "utils/requests";
import { FileUpload } from "primereact/fileupload";
import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { Counter } from "components/counter/Counter";
import { Dropdown } from "primereact/dropdown";
import Titlebar from "components/titlebar/Titlebar";

import logo from "logo.svg";
import styles from "components/App.module.scss";

function App() {
  const [ports, setPorts] = useState([]);
  const [port, setport] = useState("");
  const [screenLoading, setscreenLoading] = useState(true);
  const [binFile, setbinFile] = useState("");
  const [patFile, setpatFile] = useState("");
  const [spiFile, setspiFile] = useState("");
  const [bootFile, setbootFile] = useState("")
  const [flashFile, setflashFile] = useState("")
  const [loading, setloading] = useState(false)


  useEffect(() => {
    /**
     * Example call to Flask
     * @see /src/utils/requests.js
     * @see /app.py
     */
    setTimeout(async () => {
      await get(
        "getport", // Route
        (response) =>
          setPorts(
            response.map((v) => ({
              label: v,
              value: v,
            }))
          ), // Response callback
        (error) => console.log(error) // Error callback
      );
      setscreenLoading(false);
    }, 3000);
  }, []);

  const uploadFile =()=>{
    setloading(true)
    post(JSON.stringify({
      port:port,
      boot:bootFile,
      flash:flashFile,
      binFile:binFile,
      spiFile:spiFile,
      patFile:patFile
    }),'upload',
    (data)=>{
      console.log('data', data)
      setloading(false)
    },
    (err)=>{
      alert(err)
    })
  }

  const getPort = () => {
    get(
      "getport", // Route
      (response) =>
        setPorts(
          response.map((v) => ({
            label: v,
            value: v,
          }))
        ), // Response callback
      (error) => console.log(error) // Error callback
    );
  };

  if (screenLoading) {
    return (
      <Fragment>
        <Titlebar />
        <div className='mt-6 flex flex-column  block'>
          <Skeleton height='50px' />
          <Skeleton
            className='mt-2 align-self-center'
            height='50px'
            width='200px'
          />
          <div className='flex justify-content-center align-items-center mt-2'>
            <Skeleton className='ml-2' height='50px' width='120px' />
            <Skeleton className='ml-2' height='50px' width='120px' />
            <Skeleton className='ml-2' height='50px' width='120px' />
          </div>
        </div>
      </Fragment>
    );
  }
  return (
    <Fragment>
      <Titlebar />

      <div className={styles.app}>
        <div className='mt-2 block  pt-5 flex flex-column '>
          <div className='text-3xl text-bluegray-400 text-center'>
            ESP Upload สำหรับ เครื่องดีดเหรียญ
          </div>
          <div className='inline flex align-self-center mt-2'>
            <Dropdown
              value={port}
              onChange={(e) => setport(e.value)}
              options={ports}
              placeholder='เลือก PORT'
            />
            <Button
              onClick={getPort}
              className='p-button-info ml-2'
              label='ค้นหา PORT ใหม่'
            />
          </div>
          <div className='flex justify-content-center align-items-center mt-2'>
            <FileUpload
              className='ml-2'
              mode='basic'
              chooseLabel='เลือกไฟล์ bootloader'
              // maxFileSize={1}

              onSelect={({ files }) => setbootFile(files[0].path)}
            />
            <FileUpload
              className='ml-2'
              mode='basic'
              chooseLabel='เลือกไฟล์ flash mode'
              // maxFileSize={1}
              onSelect={({ files }) => setflashFile(files[0].path)}
            />
          </div>
          <div className='flex justify-content-center align-items-center mt-2'>
            <FileUpload
              className='ml-2'
              mode='basic'
              chooseLabel='เลือกไฟล์ bin'
              // maxFileSize={1}

              onSelect={({ files }) => setbinFile(files[0].path)}
            />
            <FileUpload
              className='ml-2'
              mode='basic'
              chooseLabel='เลือกไฟล์ partitions'
              // maxFileSize={1}
              onSelect={({ files }) => setpatFile(files[0].path)}
            />
            <FileUpload
              className='ml-2'
              mode='basic'
              chooseLabel='เลือกไฟล์ spiffs'
              // maxFileSize={1}
              onSelect={({ files }) => setspiFile(files[0].path)}
            />
          </div>
          <Button 
          loading={loading}
            onClick={uploadFile}
            disabled={
              binFile.length === 0 ||
              spiFile.length === 0 ||
              patFile.length === 0 || 
              bootFile.length === 0 || 
              flashFile.length === 0
            }
            className='mt-2 p-button-success'
            label='Upload'
          />
        </div>
      </div>
    </Fragment>
  );
}

export default App;
