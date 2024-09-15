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
  width: 720,
  height: 1280,
  facingMode: "user"
  // facingMode: { exact: "environment" }
};

function App() {
  const webcamRef = useRef(null);
  // const capture = useCallback(
  //   () => {
  //     const imageSrc = webcamRef.current.getScreenshot();
  //     console.log(imageSrc)
  //   },
  //   [webcamRef]
  // );

  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [showCamera, setShowCamera] = useState<boolean>(false);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Fetch data for restaurants and recent visits
    // Placeholder data fetching functions
    fetchRestaurants();
    fetchRecentVisits();
  }, []);

  const onUserMedia = useCallback(() => {
    setTimeout(() => setCameraReady(true), 150)
  }, [])

  const captureCallback = useCallback(() => {
    // setShowCamera(false)
    // setCameraReady(false)
    const src = (webcamRef.current as any).getScreenshot();
    setImageSrc(src)

  }, [])

  const closeCallback = useCallback(() => {
    setShowCamera(false)
    setCameraReady(false)
    setImageSrc(undefined)
  }, [])

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
                backgroundColor: "rgba(0,0,0,0.8)"
              }
            }}
            style={{position: "absolute", top: 0, left: 0, height: "100vh", width: "100vw", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "32px", flexGrow: 1}}
            >
              <IoMdClose style={{position: "absolute", top: "24px", right: "32px", height: "32px", width: "32px"}} onClick={closeCallback} />
            {!cameraReady && <div
              style={{position: "absolute", left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)"}}
              >
              <ClipLoader 
                size={65}
                color='#FFF'
                speedMultiplier={0.75}
                loading
                />
            </div>}
            <div style={{borderRadius: "16px", zIndex: 2, width: "90vw", height: "160vw", overflow: "hidden"}}>
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
            {imageSrc && 
            <motion.div 
            initial={{filter: "brightness(1)", width: "100%"}}
            animate={{filter: ["brightness(1.4)", "brightness(1)"], width: "30%"}}
            exit={{filter: "brightness(1)", width: "30%"}}
            >
              <img src={imageSrc} style={{zIndex: 2, height: "100%", width: "100%"}} />
            </motion.div>
            
            }
            </div>
            <button onClick={captureCallback} className='scan-menu-btn' style={{margin: "16px 0px", width: "90%"}}>Caputre</button>
          </motion.div>
        }
      </AnimatePresence>
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

export default App