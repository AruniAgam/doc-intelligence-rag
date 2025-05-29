'use client';
import UploadForm from '@/components/UploadForm';

export default function Home() {
  const handleUpload = async (files) => {
    const formData = new FormData();
    formData.append('file', files[0]);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/upload/', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center mt-[100px]">Upload a Document</h1>
      <UploadForm onUpload={handleUpload} />
    </main>
  );
}
