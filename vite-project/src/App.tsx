// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import appLogo from '/favicon.svg'
// import PWABadge from './PWABadge.tsx'
import Webcam from 'react-webcam'
import { FaMapLocationDot } from "react-icons/fa6";
import './App.css'
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdClose } from "react-icons/io";


const videoConstraints = {
  // width: 720,
  // height: 1280,
  // facingMode: "user"
  // width: 1280,
  // height: 720,
  facingMode: { exact: "environment" }
};

function extractBase64Data(dataURL: string) {
  // Check if the input is a valid string
  if (typeof dataURL !== 'string') {
    throw new Error('The provided data URL must be a string.');
  }

  // Find the index where the base64 data starts
  const base64Index = dataURL.indexOf('base64,');
  if (base64Index === -1) {
    throw new Error('Invalid data URL: base64 information not found.');
  }

  // Extract and return the base64 encoded data
  const base64Data = dataURL.substring(base64Index + 7); // 'base64,'.length === 7
  return base64Data;
}

interface CarbonCost {
  carbon_cost: number;
  red_flags: string[];
  score: number;
  item_name: string;
}

async function postImage(argumentString: string) {
  return fetch('https://b5bf-192-54-222-137.ngrok-free.app/score_menu', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ image: argumentString })
  })
    .then(response => response.json())
    .then(data => {
      // The response is a list of items with the specified model
      console.log(data);
      return data.item_list as CarbonCost[]
    })
    .catch(error => {
      console.error('Error:', error);
      return [] as CarbonCost[]
    });
}

function App() {
  const webcamRef = useRef(null);
  // const capture = useCallback(
  //   () => {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     console.log(imageSrc)
  //   },
  //   [webcamRef]
  // );

  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<CarbonCost[] | undefined>(undefined);

  const onUserMedia = useCallback(() => {
    setTimeout(() => setCameraReady(true), 150)
  }, [])

  const captureCallback = useCallback(async () => {
    const src = (webcamRef.current as any).getScreenshot();
    setImageSrc(src)
    setIsLoading(true)
    const res = await postImage(extractBase64Data(src))
    setIsLoading(false)
    console.log("got data", res)
    setData(res)
  }, [])

  const closeCallback = useCallback(() => {
    setShowCamera(false)
    setCameraReady(false)
    setImageSrc(undefined)
    setData(undefined)
  }, [])

  return (
    <div style={{display: "flex", padding: "12px", flexDirection: "column"}}>
      <AnimatePresence>
        {showCamera && 
          <motion.div
            initial={"initial"}
            animate={"animate"}
            exit={{ 
              opacity: 0,
              backgroundColor: "rgba(0,0,0,0)"
            }}
            variants={{
              "initial": {
                opacity: 0,
                backgroundColor: "rgba(0,0,0,0)"
              },
              "animate": {
                opacity: 1,
                backgroundColor: "rgba(0,0,0,0.99)"
              }
            }}
            style={{position: "absolute", top: 0, left: 0, height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", flexGrow: 1}}
            >
              <IoMdClose style={{position: "absolute", top: "24px", right: "32px", height: "32px", width: "32px", zIndex: 4}} onClick={closeCallback} />
            {(!cameraReady || isLoading) && <div
              style={{position: "absolute", left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)"}}
              >
              <ClipLoader 
                size={65}
                color='#FFF'
                speedMultiplier={0.75}
                loading
                />
            </div>}
            <motion.div style={{marginTop: data ? "64px" : "0px", borderRadius: "16px", zIndex: 2, width: "90vw", height: data ? "95vh" : "160vw", overflow: "hidden", display: "flex", flexDirection: "column", transition: "height ease 200ms"}}>
              {!imageSrc && <Webcam
                audio={false}
                height={"100%"}
                width={"100%"}
                style={{opacity: cameraReady ? 1 : 0, transition: "opacity ease 200ms", zIndex: 2}}
                onUserMedia={onUserMedia}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
              />}
              {!data && 
              <motion.div
                initial={{marginTop: "0px"}}
                animate={{marginTop: "-100px"}}
                exit={{marginTop: "0px"}}
              >
              {imageSrc && 
                <motion.div 
                initial={{filter: "brightness(1)", width: "100%"}}
                animate={{filter: ["brightness(1.4)", "brightness(1)"], width: "30%"}}
                exit={{filter: "brightness(1)", width: "30%"}}
                >
                  <img src={imageSrc} style={{zIndex: 2, height: "100%", width: "100%"}} />
                </motion.div>
              }
              </motion.div>
              }
              {data && <CarbonCostList items={data} />}
            </motion.div>
            {!data && <button onClick={captureCallback} className='scan-menu-btn' style={{margin: "16px 0px", width: "90%"}}>Caputre</button>}
          </motion.div>
        }
      </AnimatePresence>
      <Mockup />
      <button className="scan-menu-btn" style={{ width: '100%' }} onClick={() => {
        setShowCamera(true)
        setCameraReady(false)
        }}>
        Scan Menu
      </button>
      {/* <button onClick={capture}>Capture photo</button> */}
    </div>
  );
}

const Mockup = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);

  useEffect(() => {
    // Fetch data for restaurants and recent visits
    // Placeholder data fetching functions
    fetchRestaurants();
    fetchRecentVisits();
  }, []);

  const fetchRestaurants = () => {
    // Fetch nearby restaurants data
    setRestaurants([
      { name: 'The Pizza Place', rating: 4.5 },
      { name: 'Wingin\'it', rating: 4.5 },
      { name: 'The Burger Garden', rating: 4.9 },
      { name: 'House of Dim Sum', rating: 4.6 },
    ]);
  };

  const fetchRecentVisits = () => {
    // Fetch recent visits data
    setRecentVisits([
      { name: 'Noodle House', rating: 4.2 },
      { name: 'Green Curry', rating: 4.0 },
      { name: 'Tsuki Ramen', rating: 4.4 },
      { name: 'Sandwich Shop', rating: 3.9 },
    ]);
  };

  return (
    <>
    <div className="search-bar">
        <input type="text" placeholder="Search for restaurants or food" />
        <button>
          <FaMapLocationDot />
        </button>
      </div>
      <div className="restaurants-list">
        <h2>Nearby Restaurants</h2>
        {restaurants.map((restaurant, index) => (
          <div key={index}>
            <p>{restaurant.name} - Rating: {restaurant.rating}</p>
          </div>
        ))}
      </div>
      <div className="recent-visits">
        <h2>Recently Visited</h2>
        {recentVisits.map((visit, index) => (
          <div key={index}>
            <p>{visit.name} - Rating: {visit.rating}</p>
          </div>
        ))}
      </div>
      </>
  )
}


interface CarbonCostListProps {
  items: CarbonCost[];
}

const CarbonCostList: React.FC<CarbonCostListProps> = ({ items }) => {
  // Function to determine the color based on the score
  const getScoreColor = (score: number): string => {
    if (score >= 0 && score <= 3) {
      return 'red';
    } else if (score >= 4 && score <= 7) {
      return 'yellow';
    } else if (score >= 8 && score <= 10) {
      return 'green';
    } else {
      return 'gray'; // Default color if score is out of range
    }
  };

  return (
    <div style={{overflow: "scroll", paddingRight: "12px"}}>
      {items.map((item, index) => {
        const color = getScoreColor(item.score);
        return (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              flexDirection: "column",
              gap: "12px"
            }}
          >
            {/* Left Side: Circle and Item Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: "32px", textAlign: "left", width: "100%" }}>
              <h3 style={{ margin: 0, flexGrow: 1 }}>{item.item_name}</h3>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: color,
                  marginRight: '1rem',
                }}
              ></div>
            </div>

            {/* Right Side: Red Flags */}
            {item.red_flags.length > 0 && (
              <p
                style={{
                  color: '#a94442',
                  backgroundColor: '#f2dede',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  margin: 0,
                }}
              >
                {item.red_flags.join(', ')}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default App