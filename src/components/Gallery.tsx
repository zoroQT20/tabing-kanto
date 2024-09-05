import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import moneyImage from "../images/money.jpg";
import churchImage from "../images/church.jpg";
import groceryImage from "../images/grocery.jpg";
import restoImage from "../images/resto.jpg";

// Fix the default marker issue in Leaflet
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const ZoomControl: React.FC = () => {
  const map = useMap();

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY < 0) {
      map.zoomIn();
    } else {
      map.zoomOut();
    }
  };

  useEffect(() => {
    map.getContainer().addEventListener("wheel", handleWheel);
    return () => {
      map.getContainer().removeEventListener("wheel", handleWheel);
    };
  }, [map]);

  return null;
};

const churchList = [
  { lat: 1.3100, lon: 103.8414, name: "Blessed Sacrament Church" },
  { lat: 1.2975, lon: 103.8420, name: "Cathedral of the Good Shepherd" },
  { lat: 1.2991, lon: 103.8270, name: "Christ the King" },
  { lat: 1.2903, lon: 103.8388, name: "Divine Mercy" },
  { lat: 1.2972, lon: 103.8483, name: "Holy Cross" },
  { lat: 1.3101, lon: 103.8524, name: "Holy Family" },
  { lat: 1.3103, lon: 103.8476, name: "Holy Spirit" },
  { lat: 1.2928, lon: 103.8361, name: "Holy Trinity" },
  { lat: 1.3106, lon: 103.8473, name: "Immaculate Heart of Mary" },
  { lat: 1.3030, lon: 103.8360, name: "Lady of Lourdes" },
  { lat: 1.2922, lon: 103.8428, name: "Nativity of the Blessed Virgin Mary" },
  { lat: 1.2919, lon: 103.8291, name: "Our Lady Queen of Peace" },
  { lat: 1.2878, lon: 103.8260, name: "Our Lady Star of the Sea" },
  { lat: 1.3006, lon: 103.8407, name: "Our Lady of Perpetual Succour" },
  { lat: 1.2931, lon: 103.8323, name: "Risen Christ" },
  { lat: 1.2916, lon: 103.8493, name: "Sacred Heart" },
  { lat: 1.3082, lon: 103.8424, name: "St Alphonsus(Novena Church)" },
  { lat: 1.3142, lon: 103.8341, name: "St Anne's Church" },
  { lat: 1.2956, lon: 103.8259, name: "St Anthony" },
  { lat: 1.2951, lon: 103.8345, name: "St Bernadette" },
  { lat: 1.3079, lon: 103.8411, name: "St Francis Xavier" },
  { lat: 1.3064, lon: 103.8343, name: "St Francis of Assisi" },
  { lat: 1.3040, lon: 103.8314, name: "St Ignatius" },
  { lat: 1.3154, lon: 103.8168, name: "St Joseph's Church(Bukit Timah)" },
  { lat: 1.2989, lon: 103.8450, name: "St Joseph's Church(Victoria Street)" },
  { lat: 1.2927, lon: 103.8319, name: "St Mary of the Angels" },
  { lat: 1.2951, lon: 103.8420, name: "St Michael" },
  { lat: 1.2908, lon: 103.8378, name: "St Stephen" },
  { lat: 1.2975, lon: 103.8367, name: "St Teresa" },
  { lat: 1.2932, lon: 103.8303, name: "St Vincent de Paul" },
  { lat: 1.2940, lon: 103.8322, name: "Sts Peter and Paul" },
  { lat: 1.3008, lon: 103.8497, name: "Transfiguration" },
];

const Gallery: React.FC = () => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false); // State for Map Modal
  const [selectedCurrency, setSelectedCurrency] = useState("PHP");
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [amountSGD, setAmountSGD] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredChurches, setFilteredChurches] = useState<{ lat: number; lon: number; name: string }[]>([]);
  
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch("https://api.exchangerate-api.com/v4/latest/SGD");
        const data = await response.json();
        setCurrencies(Object.keys(data.rates));
      } catch (error) {
        console.error("Error fetching currencies:", error);
      }
    };

    fetchCurrencies();
  }, []);

  const fetchExchangeRate = async (currency: string) => {
    try {
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/SGD");
      const data = await response.json();
      const rate = data.rates[currency];
      setExchangeRate(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
    }
  };

  const handleCurrencySelection = (currency: string) => {
    setSelectedCurrency(currency);
    fetchExchangeRate(currency);
    setShowCurrencySelector(false);
    setShowModal(true);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setShowModal(false);
      setShowCurrencySelector(false);
      setSearchQuery("");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmountSGD(Number(event.target.value));
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toUpperCase());
  };

  const filteredCurrencies = currencies.filter((currency) =>
    currency.toUpperCase().includes(searchQuery)
  );

  const convertedAmount = exchangeRate ? (amountSGD * exchangeRate).toFixed(2) : "...";

  return (
    <div className="w-full h-fit bg-[#7c3732] rounded-lg p-4 md:p-8 gap-4">
      <h2 className="text-white text-2xl font-extrabold mb-4">Quick Links</h2>
      <div className="grid grid-cols-2 gap-2">
        {/* Card 1 */}
        <div
          className="relative flex items-center justify-center flex-col cursor-pointer"
          onClick={() => setShowCurrencySelector(true)}
        >
          <img
            className="w-80 h-80 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
            src={moneyImage}
            alt="Gallery Image 1"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            SGD Coin Converter
          </div>
        </div>
        {/* Card 2 */}
        <div
          className="relative flex items-center justify-center flex-col cursor-pointer"
          onClick={() => setShowMapModal(true)} // Open map modal on click
        >
          <img
            className="w-80 h-80 object-cover rounded-lg transform transition-transform duration-300 ease-in-out hover:scale-105"
            src={churchImage}
            alt="Gallery Image 2"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            Catholic Churches around Singapore
          </div>
        </div>
        {/* Card 3 */}
        <div className="flex items-center justify-center">
          <img
            className="w-80 h-80 object-cover rounded-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            src={groceryImage}
            alt="Gallery Image 3"
          />
        </div>
        {/* Card 4 */}
        <div className="flex items-center justify-center">
          <img
            className="w-80 h-80 object-cover rounded-lg cursor-pointer transform transition-transform duration-300 ease-in-out hover:scale-105"
            src={restoImage}
            alt="Gallery Image 4"
          />
        </div>
      </div>

      {/* Currency Selection Modal */}
      {showCurrencySelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-96">
            <h3 className="text-xl font-bold mb-4">Select a Currency</h3>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search currencies..."
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <ul className="max-h-60 overflow-y-auto">
              {filteredCurrencies.map((currency) => (
                <li
                  key={currency}
                  className="p-2 hover:bg-gray-200 cursor-pointer"
                  onClick={() => handleCurrencySelection(currency)}
                >
                  {currency}
                </li>
              ))}
            </ul>
            <button
              className="mt-4 p-2 bg-gray-500 text-white rounded hover:bg-gray-700"
              onClick={() => {
                setShowCurrencySelector(false);
                setSearchQuery(""); // Reset search query when closing the modal
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Exchange Rate Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="bg-white p-8 rounded-lg w-96 relative shadow-lg border border-gray-300"
          >
            <h3 className="text-xl font-bold mb-4">Exchange Rate</h3>
            <div className="mb-4">
              <label className="block text-lg mb-2">Amount in SGD</label>
              <input
                type="number"
                value={amountSGD}
                onChange={handleAmountChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <p className="text-lg mb-6">
              {exchangeRate ? `1 SGD = ${exchangeRate} ${selectedCurrency}` : "Loading exchange rate..."}
            </p>
            <p className="text-lg mb-6">
              {exchangeRate ? `${amountSGD} SGD = ${convertedAmount} ${selectedCurrency}` : ""}
            </p>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setShowModal(false);
                setSearchQuery(""); // Reset search query when closing the modal
              }}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* OpenStreetMap Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-[90%] md:w-[50%] relative">
            <h3 className="text-xl font-bold mb-4">Map Location</h3>
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
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
