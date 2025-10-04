import museumRoom from "../assets/museum-sample.jpg"

const MuseumPicture = () => {
  return (
    <div className="w-full h-full overflow-hidden">
      <img
        src={museumRoom}
        alt="Museum Room"
        className="w-full h-full object-cover min-w-4xl"
      />
    </div>
  );
}

export default MuseumPicture;
