import React, { useState, useEffect } from 'react';
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import MuseumPicture from './MuseumPicture';

// HACK: 仮の画像URL
import museumImage from '../assets/museums/museum-1.jpg';
// const [museumImage, setMuseumImage] = useState<string>('');

const MuseumScreen = () => {
  interface museumItem {
    id: number;
    title: string;
    imageUrl: string;
  }

  const museumItem: museumItem = 
    {
      id: 1,
      title: '美しい山の風景',
      imageUrl: museumImage
    };

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  // HACK: 仮タイトル
  title === '' && setTitle(museumItem.title);

  // HACK: 仮のAPIエンドポイント
  // useEffect(() => {
  //   fetch('/api/museum/image')
  //     .then(res => res.json())
  //     .then(data => setMuseumImage(data.imageUrl))
  //     .catch(() => setMuseumImage(''));
  // }, []);

  return (
    <div className="min-h-screen max-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
        <div className="w-full max-w-6xl mx-auto pt-6 px-4">
          <a
            href="/show"
            className="text-blue-600 hover:underline font-medium flex items-center gap-1"
          >
            &larr; 一覧へ戻る
          </a>
        </div>
      <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col h-full max-h-screen">
        <div className="flex-1 relative bg-white rounded-lg shadow-2xs overflow-hidden flex flex-col">
        <div className="relative bg-white rounded-sm shadow-2xs overflow-hidden h-[650px] w-full flex items-center justify-center">
          <MuseumPicture imageUrl={museumItem.imageUrl} />
        </div>
        </div>
        <div className="flex justify-center items-center gap-8 mt-4">
        <div className="p-4 bg-white rounded-sm shadow-md flex items-center gap-4">
          <input
          type="text"
          className="w-80 text-gray-800 font-bold text-2xl bg-transparent outline-none text-center placeholder-neutral-300"
          value={title}
          placeholder='タイトル'
          readOnly={!isEditing}
          onChange={e => setTitle(e.target.value)}
          />
          <button
          className="ml-2 p-1 rounded font-bold text-gray-800"
          onClick={() => setIsEditing(!isEditing)}
          >
          <IconContext.Provider value={{ size: '1.5em' }}>
            {isEditing ? (
            <span role="img" aria-label="save"><MdOutlineCheck /></span>
            ) : (
            <span role="img" aria-label="edit"><MdOutlineEdit /></span>
            )}
          </IconContext.Provider>
          </button>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default MuseumScreen;
