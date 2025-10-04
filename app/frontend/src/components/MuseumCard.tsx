import React from 'react';

interface CardItem {
  id: number;
  title: string;
  imageUrl: string;
}

interface CardProps {
  item: CardItem;
}

const Card: React.FC<CardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-sm shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img 
        src={item.imageUrl} 
        alt={item.title}
        className="w-full h-56 object-cover"
      />
      <div className="p-4">
        <p className="text-lg text-gray-800">{item.title}</p>
      </div>
    </div>
  );
};

export default Card;