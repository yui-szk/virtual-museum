import React, { useState } from 'react';
import { IconContext } from 'react-icons'
import { MdOutlineEdit, MdOutlineCheck } from "react-icons/md";
import MuseumPicture from './MuseumPicture';

const MuseumScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      {/* Gallery View */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl">
          {/* Gallery Room Image */}
          <div className="relative bg-white rounded-lg shadow-2xs overflow-hidden">
            {/* Gallery Wall with Frames */}
            <div className="relative bg-gradient-to-b from-white via-gray-50 to-gray-100 px-4 py-4 min-h-[400px]">
              <MuseumPicture />
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex justify-between items-center gap-8 mt-4">
            <a 
              href="/create/new"
              className="px-4 py-5 w-40 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg shadow-md flex items-center justify-center"
            >
              <div className="text-gray-800 font-bold text-xl">新規作成</div>
            </a>

            <div className="p-4 bg-white rounded-lg shadow-md flex items-center gap-4">
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

            <a 
              href="/create"
              className="px-4 py-5 w-40 bg-gray-200 hover:bg-gray-300 transition-colors rounded-lg shadow-md flex items-center justify-center"
            >
              <div className="text-gray-800 font-bold text-xl">編集</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuseumScreen;