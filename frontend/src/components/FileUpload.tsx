"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/ocr", {
      method: "POST",
      body: formData,
    });


    const data = await res.json();

    router.push(`/chat?documentId=${data.documentId}`);

    setUploading(false);
  };

  /*const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
  
    // Mock do backend (simula upload e resposta após 1 segundo)
    setTimeout(() => {
      // Gere um ID fake para simular o retorno do backend
      const fakeId = "123456";
      router.push(`/chat?documentId=${fakeId}`);
      setUploading(false);
    }, 1000);
  };*/
  

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        accept=".jpeg, .png, .jpg"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                   file:text-sm file:font-semibold file:bg-blue-600 file:text-white
                   hover:file:bg-blue-700 bg-gray-800 text-gray-200"
      />
      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {uploading ? "Enviando..." : "Enviar Documento"}
      </button>
    </div>
  );
};

export default FileUpload;
