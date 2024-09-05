import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import React, { useState } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import churchList from "../../assets/data/churches.json";
import ZoomControl from "../ZoomControl";

// Fix the default marker issue in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const CatholicChurches: React.FC = () => {
  const [filteredChurches, setFilteredChurches] = useState<
    { lat: number; lon: number; name: string }[]
  >([]);
  const [showMapModal, setShowMapModal] = useState(false); // State for Map Modal

  return (
    <div>
      <div
        className="relative flex items-center justify-center flex-col cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
        onClick={() => setShowMapModal(true)} // Open map modal on click
      >
        <img
          className="w-full h-[200px] object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
          src="/images/church.jpg"
          alt="Catholic Churches"
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          Catholic Churches around Singapore
        </div>
      </div>
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-2 rounded-lg w-[90%] md:w-[50%] relative">
            <h3 className="text-xl font-bold mb-4">Church Location</h3>
            <MapContainer
              center={[1.3521, 103.8198]} // Coordinates of Singapore (example)
              zoom={13}
              scrollWheelZoom={false}
              style={{ height: "400px", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl />
              {/* Display only churches */}
              {churchList.map((church, idx) => (
                <Marker key={idx} position={[church.lat, church.lon]}>
                  <Popup>{church.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => setShowMapModal(false)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CatholicChurches;