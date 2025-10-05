import React from 'react'
import Card from './MuseumCard'
import museumSample from '../assets/museum-sample.jpg'
import museumRoom from '../assets/museum-room.jpg'

interface CardItem {
  id: number
  title: string
  imageUrl: string
}

const CardList: React.FC = () => {
  // HACK: ダミーデータ
  const items: CardItem[] = [
    {
      id: 1,
      title: '美しい山の風景',
      imageUrl: museumSample,
    },
    {
      id: 2,
      title: '海辺の夕日',
      imageUrl: museumRoom,
    },
    {
      id: 3,
      title: '都会の夜景',
      imageUrl: museumSample,
    },
    {
      id: 4,
      title: '森の中の小道',
      imageUrl: museumRoom,
    },
    {
      id: 5,
      title: '桜の花',
      imageUrl: museumSample,
    },
    {
      id: 6,
      title: '雪山の景色',
      imageUrl: museumRoom,
    },
    {
      id: 7,
      title: '森の中の小道',
      imageUrl: museumSample,
    },
    {
      id: 8,
      title: '桜の花',
      imageUrl: museumRoom,
    },
    {
      id: 9,
      title: '雪山の景色',
      imageUrl: museumSample,
    },
  ]

  // ページネーション用の状態
  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 6
  const totalPages = Math.ceil(items.length / itemsPerPage)

  // 現在のページに表示するアイテム
  const paginatedItems = items.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="min-h-screen py-10 px-20 w-full">
      <div className="max-w-screen mx-auto">
        <div className="flex items-center justify-between mb-8">
          <a href="/" className="text-blue-600 hover:underline font-medium flex items-center gap-1">
            &larr; トップへ戻る
          </a>
          <h1 className="text-3xl font-bold text-gray-900 text-center">My美術館</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedItems.map((item) => (
            <a href={`/view/${item.id}`} key={item.id}>
              <Card item={item} />
            </a>
          ))}
        </div>
        <div className="flex justify-center mt-8 space-x-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            前へ
          </button>
          <span className="px-4 py-2">
            {currentPage} / {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            次へ
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardList
