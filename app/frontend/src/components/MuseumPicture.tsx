interface MuseumPictureProps {
  imageUrl: string;
}

const MuseumPicture = ({ imageUrl }: MuseumPictureProps) => {
  return (
    <div className="w-full h-full overflow-hidden flex items-center justify-center">
      <img
        src={imageUrl}
        alt="Museum Room"
        className="h-full w-auto object-contain"
      />
    </div>
  );
}

export default MuseumPicture;
