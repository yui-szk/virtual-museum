interface MuseumPictureProps {
  imageUrl: string
}

const MuseumPicture = ({ imageUrl }: MuseumPictureProps) => {
  return (
    <div className="w-full h-full overflow-hidden">
      <img src={imageUrl} alt="Museum Room" className="w-full h-full object-cover min-w-4xl" />
    </div>
  )
}

export default MuseumPicture
