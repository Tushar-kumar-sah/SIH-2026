'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { districts } from '../data/diseases';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

// Dark-themed map styling for the agritech aesthetic
const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a0f1e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4a5568' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#111827' }] },
  { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0c1929' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1321' }] },
];

const riskMarkerColors = {
  high: '#ef4444',
  medium: '#eab308',
  low: '#10b981',
};

const riskLabels = {
  high: 'High Risk Zone',
  medium: 'Moderate Risk',
  low: 'Low Risk',
};

let googleMapsPromise = null;

function loadGoogleMapsScript(apiKey) {
  if (typeof window === 'undefined') return Promise.reject('SSR');
  if (window.google?.maps?.Map) {
    return Promise.resolve(window.google.maps);
  }
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector('script[id="google-maps-js-sdk"]');
    if (existingScript) {
      if (window.google?.maps?.Map) {
        resolve(window.google.maps);
      } else {
        const originalCallback = window.__googleMapsCallback;
        window.__googleMapsCallback = () => {
          if (originalCallback) originalCallback();
          resolve(window.google.maps);
        };
        existingScript.addEventListener('error', (err) => reject(err));
      }
      return;
    }

    window.__googleMapsCallback = () => {
      resolve(window.google.maps);
    };

    const script = document.createElement('script');
    script.id = 'google-maps-js-sdk';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&loading=async&callback=__googleMapsCallback`;
    script.async = true;
    script.defer = true;
    script.onerror = (err) => reject(err);
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function GoogleMap({ activeDistrict, districts: allDistricts }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const circlesRef = useRef([]);
  const infoWindowRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!GOOGLE_MAPS_KEY) return;
    let isMounted = true;

    loadGoogleMapsScript(GOOGLE_MAPS_KEY)
      .then(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      })
      .catch((err) => {
        console.error('Error loading Google Maps SDK:', err);
      });

    return () => {
      isMounted = false;
    };
  }, []);


  const updateMarkers = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !window.google?.maps) return;

    // Clear existing markers and circles
    markersRef.current.forEach((m) => m.setMap(null));
    circlesRef.current.forEach((c) => c.setMap(null));
    markersRef.current = [];
    circlesRef.current = [];

    // Add markers for all districts
    allDistricts.forEach((district) => {
      const isActive = district.id === activeDistrict.id;
      const riskColor = district.riskColor === 'danger' ? '#ef4444' : district.riskColor === 'warning' ? '#eab308' : '#10b981';

      // District marker
      const regularMarker = new window.google.maps.Marker({
        position: { lat: district.lat, lng: district.lng },
        map,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: isActive ? 14 : 8,
          fillColor: riskColor,
          fillOpacity: isActive ? 0.9 : 0.6,
          strokeColor: '#fff',
          strokeWeight: isActive ? 2 : 1,
        },
        title: `${district.name} — ${district.riskLevel} Risk`,
        zIndex: isActive ? 100 : 10,
      });

      // Risk radius circle
      const circle = new window.google.maps.Circle({
        center: { lat: district.lat, lng: district.lng },
        radius: isActive ? 35000 : 20000,
        map,
        fillColor: riskColor,
        fillOpacity: isActive ? 0.15 : 0.06,
        strokeColor: riskColor,
        strokeOpacity: isActive ? 0.5 : 0.2,
        strokeWeight: 1,
      });

      // Add outbreak risk sub-nodes around the district
      if (isActive && district.nodes) {
        district.nodes.forEach((node, i) => {
          const offsetLat = district.lat + (node.y - 40) * 0.004;
          const offsetLng = district.lng + (node.x - 40) * 0.004;
          const nodeColor = riskMarkerColors[node.risk];

          const nodeMarker = new window.google.maps.Marker({
            position: { lat: offsetLat, lng: offsetLng },
            map,
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 7,
              fillColor: nodeColor,
              fillOpacity: 0.8,
              strokeColor: nodeColor,
              strokeWeight: 1,
            },
            title: riskLabels[node.risk],
          });

          nodeMarker.addListener('click', () => {
            infoWindowRef.current.setContent(
              `<div style="background:#0f172a;color:#e2e8f0;padding:8px 12px;border-radius:8px;font-size:12px;font-family:Inter,sans-serif;">
                <strong style="color:${nodeColor}">${riskLabels[node.risk]}</strong><br/>
                <span style="color:#94a3b8;">Outbreak Node ${i + 1}</span>
              </div>`
            );
            infoWindowRef.current.open(map, nodeMarker);
          });

          markersRef.current.push(nodeMarker);
        });
      }

      // Info window on marker click
      regularMarker.addListener('click', () => {
        infoWindowRef.current.setContent(
          `<div style="background:#0f172a;color:#e2e8f0;padding:10px 14px;border-radius:8px;font-family:Inter,sans-serif;min-width:180px;">
            <div style="font-size:14px;font-weight:700;margin-bottom:4px;">${district.emoji} ${district.name}</div>
            <div style="font-size:11px;color:${riskColor};font-weight:600;margin-bottom:6px;">Risk: ${district.riskLevel}</div>
            <div style="font-size:11px;color:#94a3b8;">🌡 ${district.temp}°C &nbsp; 💧 ${district.humidity}% RH &nbsp; 🌬 ${district.wind} km/h</div>
          </div>`
        );
        infoWindowRef.current.open(map, regularMarker);
      });

      markersRef.current.push(regularMarker);
      circlesRef.current.push(circle);
    });

    // Pan to active district
    map.panTo({ lat: activeDistrict.lat, lng: activeDistrict.lng });
    map.setZoom(9);
  }, [activeDistrict, allDistricts]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
      center: { lat: 19.0, lng: 76.0 },
      zoom: 7,
      styles: MAP_STYLES,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    });
    infoWindowRef.current = new window.google.maps.InfoWindow();
    updateMarkers();
  }, [isLoaded, updateMarkers]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      updateMarkers();
    }
  }, [activeDistrict, updateMarkers]);

  if (!GOOGLE_MAPS_KEY) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-white/[0.05]">
        <p className="text-xs text-slate-500">Google Maps API key not configured</p>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full rounded-xl" style={{ minHeight: '400px' }} />;
}

export default function OutbreakHeatmap() {
  const [activeDistrict, setActiveDistrict] = useState(districts[0]);

  return (
    <section id="heatmap" className="relative py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-danger/10 text-danger border border-danger/20 mb-4">
            🗺️ Real-Time Outbreak Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-outfit)] text-slate-100 mb-3">
            District Outbreak <span className="gradient-text-blue">Heatmap</span> & Weather Risk
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Live disease risk visualization across Maharashtra districts powered by Google Maps, Open-Weather API and ISRO Bhuvan GIS data.
          </p>
        </motion.div>

        {/* District Chips */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="flex flex-wrap justify-center gap-2 mb-8">
          {districts.map((d) => (
            <button
              key={d.id}
              onClick={() => setActiveDistrict(d)}
              className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 ${
                activeDistrict.id === d.id
                  ? 'bg-neon-blue/15 border-neon-blue/40 text-neon-blue shadow-[0_0_15px_rgba(59,130,246,0.2)]'
                  : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:border-white/[0.15] hover:text-slate-300'
              }`}
            >
              {d.emoji} {d.name}
            </button>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map Container (3 cols) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="lg:col-span-3">
            <div className="glass-card p-4 h-full">
              <div className="flex items-center justify-between px-2 mb-3">
                <span className="text-xs font-medium text-slate-400">🗺️ Maharashtra — Live Outbreak Map</span>
                <span className="flex items-center gap-3 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-danger"></span> High</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-warning"></span> Medium</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-health"></span> Low</span>
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-white/[0.05]" style={{ height: '420px' }}>
                <GoogleMap activeDistrict={activeDistrict} districts={districts} />
              </div>
            </div>
          </motion.div>

          {/* Weather & Alerts (2 cols) */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} className="lg:col-span-2 space-y-4">
            {/* Weather Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="glass-card p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Humidity</p>
                <p className="text-xl font-bold font-[family-name:var(--font-outfit)] text-neon-blue">{activeDistrict.humidity}%</p>
                <p className="text-[10px] text-slate-600">RH</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Temp</p>
                <p className="text-xl font-bold font-[family-name:var(--font-outfit)] text-saffron">{activeDistrict.temp}°C</p>
                <p className="text-[10px] text-slate-600">Surface</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Wind</p>
                <p className="text-xl font-bold font-[family-name:var(--font-outfit)] text-slate-300">{activeDistrict.wind}</p>
                <p className="text-[10px] text-slate-600">km/h</p>
              </div>
            </div>

            {/* Alert Banner */}
            <div className={`glass-card p-4 border-l-4 ${
              activeDistrict.riskColor === 'danger'
                ? 'border-l-danger'
                : activeDistrict.riskColor === 'warning'
                ? 'border-l-warning'
                : 'border-l-health'
            }`}>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider mb-2">🚨 Micro-Climate Alert</p>
              <p className="text-sm text-slate-300 leading-relaxed">{activeDistrict.alert}</p>
            </div>

            {/* Broadcast Button */}
            <button className="w-full py-3 rounded-xl glass-card text-sm font-medium text-slate-300 hover:text-white hover:border-white/[0.15] transition-all duration-300 flex items-center justify-center gap-2">
              <span>📡</span>
              Broadcast SMS / WhatsApp Alert to Farmers
            </button>

            {/* Data source attribution */}
            <div className="text-center">
              <p className="text-[10px] text-slate-600">
                Data: Google Maps Platform • Open-Weather API • ISRO Bhuvan GIS • IMD Advisory Feed
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
