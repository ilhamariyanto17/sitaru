import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import {
  Plus,
  Minus,
  Maximize,
  Layers,
  Compass,
  Loader2,
  AlertTriangle,
  RotateCw,
} from 'lucide-react';

import {
  generateBuildingFeatures,
  STATUS_COLORS,
  HIGHLIGHT_COLOR,
} from '../data/generateBuildings';

import { kawasan } from '../data/dummyData';

// Membuat markup popup "Lihat Analisis" yang konsisten untuk mode GL & Leaflet
function buildPopupHTML(p, featureId, interactive) {
  return `
    <div style="font:12px Inter,sans-serif;color:#0b0f1a;line-height:1.6;min-width:180px;">
      <strong>${p.alamat || 'Bangunan'}</strong><br/>
      KDB: ${p.kdb ?? '-'}% · KLB: ${p.klb ?? '-'}<br/>
      Tinggi: ${p.height ?? 0} m
      ${
        interactive
          ? `<button
              data-analisis-id="${featureId}"
              style="
                margin-top:8px;
                width:100%;
                padding:6px 10px;
                background:#2563eb;
                color:#fff;
                border:none;
                border-radius:6px;
                font-size:12px;
                font-weight:600;
                cursor:pointer;
              "
            >Lihat Analisis →</button>`
          : ''
      }
    </div>
  `;
}

function featureCentroid(feature) {
  const coords = feature.geometry.coordinates[0];
  const lngs = coords.map((c) => c[0]);
  const lats = coords.map((c) => c[1]);
  return [
    (Math.min(...lngs) + Math.max(...lngs)) / 2,
    (Math.min(...lats) + Math.max(...lats)) / 2,
  ];
}


// ============================================================
// BASEMAP PROVIDERS
// ============================================================

// MAX_ZOOM: batas zoom tertinggi yang diizinkan di peta (UI/kontrol zoom).
// nativeMaxZoom per provider: zoom tertinggi yang BENAR-BENAR punya ubin (tile)
// dari server sumbernya. Di atas angka ini, tile terakhir yang tersedia akan
// di-"overzoom" (diperbesar) oleh Leaflet/MapLibre alih-alih menampilkan
// peta kosong/putih — inilah penyebab peta terlihat "bug" saat di-zoom penuh.
const MAX_ZOOM = 24;

const BASEMAP_PROVIDERS = [
  {
    id: 'osm',

    tiles: [
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
      'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
    ],

    attribution: '© OpenStreetMap contributors',

    nativeMaxZoom: 19,
  },

  {
    id: 'opentopomap',

    tiles: [
      'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
      'https://c.tile.opentopomap.org/{z}/{x}/{y}.png',
    ],

    attribution:
      '© OpenStreetMap contributors © OpenTopoMap',

    nativeMaxZoom: 17,
  },

  {
    id: 'esri-street',

    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
    ],

    attribution:
      '© Esri, HERE, Garmin, OpenStreetMap contributors',

    nativeMaxZoom: 19,
  },

  {
    id: 'esri-imagery',

    tiles: [
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],

    attribution:
      '© Esri, Maxar, Earthstar Geographics',

    nativeMaxZoom: 19,
  },
];


// ============================================================
// MAP STYLE
// ============================================================

function buildStyle(provider) {
  return {
    version: 8,

    sources: {
      [provider.id]: {
        type: 'raster',

        tiles: provider.tiles,

        tileSize: 256,

        attribution: provider.attribution,

        // Zoom asli tile server. MapLibre otomatis "overzoom" (memperbesar
        // ubin terakhir) di atas angka ini, bukan menampilkan area kosong.
        maxzoom: provider.nativeMaxZoom ?? 19,
      },
    },

    layers: [
      {
        id: `${provider.id}-layer`,

        type: 'raster',

        source: provider.id,

        minzoom: 0,

        // Batas tampil layer, BUKAN batas tile — harus mengikuti MAX_ZOOM
        // peta, kalau tidak layer akan hilang total begitu user zoom > 20.
        maxzoom: MAX_ZOOM,
      },
    ],
  };
}


// ============================================================
// LEGEND
// ============================================================

const LEGEND = [
  {
    label: 'Sesuai',
    color: STATUS_COLORS.sesuai,
  },

  {
    label: 'Perlu Verifikasi',
    color: STATUS_COLORS.perlu_verifikasi,
  },

  {
    label: 'Tidak Sesuai',
    color: STATUS_COLORS.tidak_sesuai,
  },

  {
    label: 'Tidak Ada Bangunan',
    color: STATUS_COLORS.tidak_ada,
  },
];


// ============================================================
// WEBGL CHECK
// ============================================================

function hasWebGL() {
  try {
    if (
      maplibregl.supported &&
      !maplibregl.supported({
        failIfMajorPerformanceCaveat: false,
      })
    ) {
      return false;
    }

    const canvas = document.createElement('canvas');

    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    );
  } catch (error) {
    console.warn(
      '[MapView] WebGL tidak tersedia:',
      error
    );

    return false;
  }
}


// ============================================================
// CENTER VALIDATION
// ============================================================

function getMapCenter() {
  if (
    !Array.isArray(kawasan?.center) ||
    kawasan.center.length < 2
  ) {
    console.error(
      '[MapView] kawasan.center tidak valid:',
      kawasan?.center
    );

    // Fallback Cimahi
    return [107.5413, -6.8722];
  }

  const lng = Number(kawasan.center[0]);
  const lat = Number(kawasan.center[1]);

  if (
    !Number.isFinite(lng) ||
    !Number.isFinite(lat)
  ) {
    console.error(
      '[MapView] Koordinat kawasan.center tidak valid:',
      kawasan.center
    );

    return [107.5413, -6.8722];
  }

  return [lng, lat];
}


// ============================================================
// COMPONENT
// ============================================================

export default function MapView({ selectedId = null, interactive = true, clickMode = 'popup' } = {}) {
  const navigate = useNavigate();

  const mapContainer = useRef(null);

  const wrapperRef = useRef(null);

  const mapRef = useRef(null);

  const leafletRef = useRef(null);

  const [is3D, setIs3D] = useState(true);

  const [mode, setMode] = useState(null);

  const center = getMapCenter();

  const [cursorInfo, setCursorInfo] = useState({
    lng: center[0],
    lat: center[1],
  });

  const [pitch, setPitch] = useState(45);

  const [status, setStatus] = useState('loading');

  const [retryTick, setRetryTick] = useState(0);


  // ============================================================
  // INITIALIZE MAP
  // ============================================================

  useEffect(() => {
    if (!mapContainer.current) {
      console.error(
        '[MapView] mapContainer belum tersedia.'
      );

      return;
    }

    const el = mapContainer.current;

    let map = null;

    let leaflet = null;

    let destroyed = false;

    let providerIndex = 0;

    let tileErrorCount = 0;

    const usingGL = hasWebGL();

    setMode(usingGL ? 'gl' : 'leaflet');


    // ========================================================
    // TIMEOUT
    // ========================================================
    // Sebelumnya 20 detik baru dianggap error — di koneksi lambat/tile
    // server yang diblokir, itu terasa lama & seperti "hang"/bug sebelum
    // akhirnya menampilkan pesan error. Dipersingkat jadi 10 detik supaya
    // pengguna lebih cepat dapat feedback (dan lebih cepat retry / pindah
    // provider basemap, lihat threshold tileErrorCount di bawah).

    const timeoutId = setTimeout(() => {
      if (!destroyed) {
        console.warn(
          '[MapView] Timeout memuat peta.'
        );

        setStatus((current) =>
          current === 'ready'
            ? current
            : 'error'
        );
      }
    }, 10000);


    // ========================================================
    // RESIZE
    // ========================================================

    const handleResize = () => {
      try {
        if (map) {
          map.resize();
        }

        if (leaflet) {
          leaflet.invalidateSize();
        }
      } catch (error) {
        console.warn(
          '[MapView] Resize error:',
          error
        );
      }
    };


    const liveResizeObserver =
      new ResizeObserver(() => {
        handleResize();
      });


    window.addEventListener(
      'resize',
      handleResize
    );


    // ========================================================
    // CREATE LEAFLET 2D
    // ========================================================

    const createLeafletMap = () => {
      if (destroyed || leaflet) {
        return;
      }

      console.log(
        '[MapView] Membuat Leaflet 2D...'
      );

      setMode('leaflet');

      const provider =
        BASEMAP_PROVIDERS[providerIndex];


      try {
        leaflet = L.map(el, {
          center: [
            center[1],
            center[0],
          ],

          zoom: 17,

          maxZoom: MAX_ZOOM,

          zoomControl: false,

          attributionControl: false,

          preferCanvas: true,
        });


        leafletRef.current = leaflet;


        // ----------------------------------------------------
        // BASEMAP
        // ----------------------------------------------------

        const layer = L.tileLayer(
          provider.tiles[0],
          {
            maxZoom: MAX_ZOOM,

            // Di atas nativeMaxZoom, Leaflet memperbesar ubin terakhir
            // (overzoom) alih-alih memuat ulang ubin yang tidak ada di
            // server (yang sebelumnya menyebabkan peta blank/"bug").
            maxNativeZoom:
              provider.nativeMaxZoom ?? 19,

            attribution:
              provider.attribution,
          }
        ).addTo(leaflet);


        layer.on(
          'tileload',
          () => {
            console.log(
              '[MapView] Leaflet tile berhasil dimuat.'
            );

            clearTimeout(timeoutId);

            setStatus('ready');
          }
        );


        layer.on(
          'tileerror',
          (error) => {
            console.error(
              '[MapView] Leaflet tile error:',
              error
            );

            providerIndex++;

            if (
              providerIndex <
              BASEMAP_PROVIDERS.length
            ) {
              console.log(
                '[MapView] Mencoba provider:',
                BASEMAP_PROVIDERS[
                  providerIndex
                ].id
              );

              leaflet.removeLayer(layer);

              createLeafletMap();

              return;
            }

            setStatus('error');
          }
        );


        // ----------------------------------------------------
        // BUILDING DATA
        // ----------------------------------------------------

        const data =
          generateBuildingFeatures(
            center
          );


        if (
          data &&
          data.features &&
          data.features.length > 0
        ) {
          const geoLayer =
            L.geoJSON(data, {
              style: (feature) => {
                const isSelected =
                  selectedId != null &&
                  feature.id === selectedId;

                const baseColor =
                  STATUS_COLORS[
                    feature.properties?.status
                  ] ||
                  STATUS_COLORS.tidak_ada;

                return {
                  color: isSelected
                    ? HIGHLIGHT_COLOR
                    : baseColor,

                  weight: isSelected ? 3.5 : 1,

                  fillColor: baseColor,

                  fillOpacity: isSelected
                    ? 0.85
                    : 0.65,

                  dashArray: isSelected
                    ? '4 2'
                    : undefined,
                };
              },


              onEachFeature: (
                feature,
                layerFeature
              ) => {
                const p =
                  feature.properties || {};

                const featureId = feature.id;


                layerFeature.bindTooltip(
                  `
                  <div
                    style="
                      font:12px Inter,sans-serif;
                      line-height:1.5;
                    "
                  >
                    <strong>
                      ${p.alamat || 'Bangunan'}
                    </strong>
                    <br/>

                    KDB:
                    ${p.kdb ?? '-'}%

                    · KLB:
                    ${p.klb ?? '-'}

                    <br/>

                    Tinggi:
                    ${p.height ?? 0} m
                  </div>
                  `,
                  {
                    sticky: true,
                  }
                );


                if (
                  interactive &&
                  clickMode === 'direct'
                ) {
                  // Mode langsung: klik bangunan
                  // langsung memilihnya (tanpa
                  // popup tombol "Lihat Analisis"),
                  // dipakai di halaman Analisis
                  // Intensitas.
                  layerFeature.on(
                    'click',
                    () => {
                      navigate(
                        `/analisis-intensitas?id=${featureId}`
                      );
                    }
                  );
                } else {
                  layerFeature.bindPopup(
                    buildPopupHTML(
                      p,
                      featureId,
                      interactive
                    ),
                    { closeButton: true }
                  );


                  if (interactive) {
                    layerFeature.on(
                      'popupopen',
                      (event) => {
                        const el =
                          event.popup.getElement();

                        const btn =
                          el?.querySelector(
                            '[data-analisis-id]'
                          );

                        btn?.addEventListener(
                          'click',
                          () => {
                            navigate(
                              `/analisis-intensitas?id=${featureId}`
                            );
                          }
                        );
                      }
                    );
                  }
                }
              },
            }).addTo(leaflet);


          if (
            geoLayer.getBounds().isValid()
          ) {
            leaflet.fitBounds(
              geoLayer
                .getBounds()
                .pad(0.05)
            );
          }


          // ------------------------------------------------
          // FLY TO SELECTED BUILDING
          // ------------------------------------------------

          if (selectedId != null) {
            const selectedFeature =
              data.features.find(
                (f) => f.id === selectedId
              );

            if (selectedFeature) {
              const [flng, flat] =
                featureCentroid(selectedFeature);

              leaflet.setView(
                [flat, flng],
                19
              );

              geoLayer.eachLayer((lyr) => {
                if (
                  lyr.feature?.id === selectedId
                ) {
                  setTimeout(() => {
                    lyr.bringToFront();

                    if (
                      clickMode !== 'direct' &&
                      lyr.getPopup?.()
                    ) {
                      lyr.openPopup();
                    }
                  }, 400);
                }
              });
            }
          }
        }


        // ----------------------------------------------------
        // MOUSE POSITION
        // ----------------------------------------------------

        leaflet.on(
          'mousemove',
          (event) => {
            setCursorInfo({
              lng: event.latlng.lng,
              lat: event.latlng.lat,
            });
          }
        );


        // ----------------------------------------------------
        // RESIZE
        // ----------------------------------------------------

        requestAnimationFrame(() => {
          leaflet?.invalidateSize();
        });


        setTimeout(() => {
          leaflet?.invalidateSize();
        }, 300);


      } catch (error) {
        console.error(
          '[MapView] Gagal membuat Leaflet:',
          error
        );

        setStatus('error');
      }
    };


    // ========================================================
    // APPLY MAPLIBRE PROVIDER
    // ========================================================

    const applyProvider = (
      mapInstance,
      index
    ) => {
      const provider =
        BASEMAP_PROVIDERS[index];

      if (!provider) {
        return;
      }


      // Hapus basemap sebelumnya
      BASEMAP_PROVIDERS.forEach(
        (item) => {
          const layerId =
            `${item.id}-layer`;

          if (
            mapInstance.getLayer(
              layerId
            )
          ) {
            mapInstance.removeLayer(
              layerId
            );
          }

          if (
            mapInstance.getSource(
              item.id
            )
          ) {
            mapInstance.removeSource(
              item.id
            );
          }
        }
      );


      // Tambahkan basemap baru
      mapInstance.addSource(
        provider.id,
        {
          type: 'raster',

          tiles: provider.tiles,

          tileSize: 256,

          attribution:
            provider.attribution,

          maxzoom: provider.nativeMaxZoom ?? 19,
        }
      );


      const layerConfig = {
        id: `${provider.id}-layer`,

        type: 'raster',

        source: provider.id,

        minzoom: 0,

        maxzoom: MAX_ZOOM,
      };


      const beforeId =
        mapInstance.getLayer(
          'bangunan-3d'
        )
          ? 'bangunan-3d'
          : undefined;


      mapInstance.addLayer(
        layerConfig,
        beforeId
      );
    };


    // ========================================================
    // NEXT PROVIDER
    // ========================================================

    const switchToNextProvider = (
      mapInstance
    ) => {
      providerIndex++;

      tileErrorCount = 0;


      if (
        providerIndex >=
        BASEMAP_PROVIDERS.length
      ) {
        console.error(
          '[MapView] Semua basemap gagal.'
        );

        setStatus('error');

        return false;
      }


      console.log(
        '[MapView] Beralih ke:',
        BASEMAP_PROVIDERS[
          providerIndex
        ].id
      );


      try {
        applyProvider(
          mapInstance,
          providerIndex
        );

        return true;
      } catch (error) {
        console.error(
          '[MapView] Gagal mengganti provider:',
          error
        );

        return false;
      }
    };


    // ========================================================
    // CREATE MAPLIBRE 3D
    // ========================================================

    const createGLMap = () => {
      if (destroyed || map) {
        return;
      }


      console.log(
        '[MapView] Membuat MapLibre 3D...'
      );


      // Jika ada bangunan terpilih, langsung mulai
      // di lokasi tersebut (tanpa animasi terbang).
      let initialCenter = center;
      let initialZoom = 16.3;
      let initialPitch = 45;
      let initialBearing = -10;

      if (selectedId != null) {
        const preData =
          generateBuildingFeatures(center);

        const preSelected =
          preData.features.find(
            (f) => f.id === selectedId
          );

        if (preSelected) {
          const [flng, flat] =
            featureCentroid(preSelected);

          initialCenter = [flng, flat];
          initialZoom = 19.5;
          initialPitch = 55;
          initialBearing = -15;
        }
      }


      try {
        map =
          new maplibregl.Map({
            container: el,

            style: buildStyle(
              BASEMAP_PROVIDERS[
                providerIndex
              ]
            ),

            center: initialCenter,

            zoom: initialZoom,

            maxZoom: MAX_ZOOM,

            pitch: initialPitch,

            bearing: initialBearing,

            antialias: true,

            attributionControl: false,
          });


        mapRef.current = map;


        liveResizeObserver.observe(
          el
        );


        // ----------------------------------------------------
        // MAP ERROR
        // ----------------------------------------------------

        map.on(
          'error',
          (event) => {
            const error =
              event?.error || event;

            const message =
              error?.message || '';


            console.error(
              '[MapView] MapLibre error:',
              error
            );


            const isTileError =
              /tile|Failed to fetch|NetworkError|404|403|429/i
                .test(message);


            if (isTileError) {
              tileErrorCount++;


              console.warn(
                '[MapView] Tile error:',
                tileErrorCount
              );


              // Sebelumnya nunggu 5 error dulu baru pindah provider —
              // kalau providernya diblokir/lambat, itu bikin lama sebelum
              // akhirnya fallback. Dipercepat jadi 2 agar lebih responsif.
              if (
                tileErrorCount >= 2
              ) {
                switchToNextProvider(
                  map
                );
              }


              return;
            }


            setStatus('error');
          }
        );


        // ----------------------------------------------------
        // MOUSE MOVE
        // ----------------------------------------------------

        map.on(
          'mousemove',
          (event) => {
            setCursorInfo({
              lng:
                event.lngLat.lng,

              lat:
                event.lngLat.lat,
            });
          }
        );


        // ----------------------------------------------------
        // MAP LOAD
        // ----------------------------------------------------

        map.on(
          'load',
          () => {
            if (destroyed) {
              return;
            }


            console.log(
              '[MapView] MapLibre berhasil load.'
            );


            clearTimeout(
              timeoutId
            );


            setStatus('ready');


            // Resize
            map.resize();


            requestAnimationFrame(
              () => {
                map?.resize();
              }
            );


            setTimeout(() => {
              map?.resize();
            }, 300);


            // ------------------------------------------------
            // BUILDING DATA
            // ------------------------------------------------

            const data =
              generateBuildingFeatures(
                center
              );


            if (
              !data ||
              !data.features
            ) {
              console.warn(
                '[MapView] Tidak ada data bangunan.'
              );

              return;
            }


            // ------------------------------------------------
            // GEOJSON SOURCE
            // ------------------------------------------------

            if (
              !map.getSource(
                'bangunan'
              )
            ) {
              map.addSource(
                'bangunan',
                {
                  type: 'geojson',

                  data,
                }
              );
            }


            // ------------------------------------------------
            // 3D BUILDING
            // ------------------------------------------------

            if (
              !map.getLayer(
                'bangunan-3d'
              )
            ) {
              map.addLayer({
                id: 'bangunan-3d',

                type:
                  'fill-extrusion',

                source: 'bangunan',

                paint: {
                  'fill-extrusion-color':
                    [
                      'case',

                      [
                        '==',
                        ['get', 'id'],
                        selectedId ?? -999999,
                      ],
                      HIGHLIGHT_COLOR,

                      [
                        'match',

                        [
                          'get',
                          'status',
                        ],

                        'sesuai',
                        STATUS_COLORS.sesuai,

                        'tidak_sesuai',
                        STATUS_COLORS.tidak_sesuai,

                        'perlu_verifikasi',
                        STATUS_COLORS.perlu_verifikasi,

                        STATUS_COLORS.tidak_ada,
                      ],
                    ],


                  'fill-extrusion-height':
                    [
                      'get',
                      'height',
                    ],


                  'fill-extrusion-base':
                    0,


                  'fill-extrusion-opacity':
                    0.92,
                },
              });
            }


            // ------------------------------------------------
            // POPUP
            // ------------------------------------------------

            const popup =
              new maplibregl.Popup({
                closeButton: false,

                closeOnClick: false,
              });


            map.on(
              'mousemove',
              'bangunan-3d',
              (event) => {
                if (
                  !event.features ||
                  !event.features.length
                ) {
                  return;
                }


                map.getCanvas()
                  .style.cursor =
                  'pointer';


                const feature =
                  event.features[0];


                const p =
                  feature.properties ||
                  {};


                popup
                  .setLngLat(
                    event.lngLat
                  )

                  .setHTML(
                    `
                    <div
                      style="
                        font:12px Inter,sans-serif;
                        color:#0b0f1a;
                        line-height:1.5;
                      "
                    >
                      <strong>
                        ${
                          p.alamat ||
                          'Bangunan'
                        }
                      </strong>

                      <br/>

                      KDB:
                      ${p.kdb ?? '-'}%

                      · KLB:
                      ${p.klb ?? '-'}

                      <br/>

                      Tinggi:
                      ${p.height ?? 0} m
                    </div>
                    `
                  )

                  .addTo(map);
              }
            );


            map.on(
              'mouseleave',
              'bangunan-3d',
              () => {
                map.getCanvas()
                  .style.cursor = '';

                popup.remove();
              }
            );


            // --------------------------------------------------
            // CLICK -> POPUP "LIHAT ANALISIS" ATAU LANGSUNG PILIH
            // --------------------------------------------------

            if (interactive && clickMode === 'direct') {
              // Mode langsung: klik bangunan langsung
              // memilihnya, tanpa popup tombol.
              // Dipakai di halaman Analisis Intensitas.
              map.on(
                'click',
                'bangunan-3d',
                (event) => {
                  if (
                    !event.features ||
                    !event.features.length
                  ) {
                    return;
                  }

                  const feature =
                    event.features[0];

                  popup.remove();

                  navigate(
                    `/analisis-intensitas?id=${feature.id}`
                  );
                }
              );
            } else if (interactive) {
              map.on(
                'click',
                'bangunan-3d',
                (event) => {
                  if (
                    !event.features ||
                    !event.features.length
                  ) {
                    return;
                  }

                  const feature =
                    event.features[0];

                  const p =
                    feature.properties || {};

                  const featureId =
                    feature.id;

                  popup.remove();

                  const clickPopup =
                    new maplibregl.Popup({
                      closeButton: true,
                      closeOnClick: true,
                    })
                      .setLngLat(
                        event.lngLat
                      )
                      .setHTML(
                        buildPopupHTML(
                          p,
                          featureId,
                          interactive
                        )
                      )
                      .addTo(map);

                  const el =
                    clickPopup.getElement();

                  const btn =
                    el?.querySelector(
                      '[data-analisis-id]'
                    );

                  btn?.addEventListener(
                    'click',
                    () => {
                      navigate(
                        `/analisis-intensitas?id=${featureId}`
                      );
                    }
                  );
                }
              );
            }


            // --------------------------------------------------
            // (Peta sudah langsung dibuka di lokasi bangunan
            // terpilih sejak awal — lihat `initialCenter` di atas)
            // --------------------------------------------------
          }
        );


      } catch (error) {
        console.error(
          '[MapView] Gagal membuat MapLibre:',
          error
        );


        map = null;

        mapRef.current = null;


        // Fallback ke Leaflet
        console.log(
          '[MapView] Beralih ke Leaflet 2D...'
        );


        setMode('leaflet');


        createLeafletMap();
      }
    };


    // ========================================================
    // CREATE
    // ========================================================

    const create = () => {
      if (destroyed) {
        return;
      }


      providerIndex = 0;


      console.log(
        '[MapView] ================================='
      );

      console.log(
        '[MapView] Memulai inisialisasi map'
      );

      console.log(
        '[MapView] Container:',
        el.offsetWidth,
        'x',
        el.offsetHeight
      );

      console.log(
        '[MapView] Center:',
        center
      );

      console.log(
        '[MapView] WebGL:',
        usingGL
      );

      console.log(
        '[MapView] ================================='
      );


      if (usingGL) {
        createGLMap();
      } else {
        console.warn(
          '[MapView] WebGL tidak tersedia, menggunakan Leaflet.'
        );

        createLeafletMap();
      }
    };


    // ========================================================
    // WAIT FOR CONTAINER
    // ========================================================

    const startWhenReady = () => {
      if (destroyed) {
        return;
      }


      const width =
        el.offsetWidth;

      const height =
        el.offsetHeight;


      console.log(
        '[MapView] Container size:',
        width,
        'x',
        height
      );


      if (
        width > 0 &&
        height > 0
      ) {
        create();

        return true;
      }


      return false;
    };


    // Coba langsung
    if (!startWhenReady()) {

      console.warn(
        '[MapView] Container belum memiliki ukuran, menunggu...'
      );


      const observer =
        new ResizeObserver(() => {
          if (
            startWhenReady()
          ) {
            observer.disconnect();
          }
        });


      observer.observe(el);


      // Cleanup tambahan
      setTimeout(() => {
        observer.disconnect();
      }, 5000);
    }


    // ========================================================
    // CLEANUP
    // ========================================================

    return () => {
      destroyed = true;


      clearTimeout(
        timeoutId
      );


      liveResizeObserver.disconnect();


      window.removeEventListener(
        'resize',
        handleResize
      );


      try {
        map?.remove();
      } catch (error) {
        console.warn(
          '[MapView] MapLibre cleanup error:',
          error
        );
      }


      try {
        leaflet?.remove();
      } catch (error) {
        console.warn(
          '[MapView] Leaflet cleanup error:',
          error
        );
      }


      mapRef.current = null;

      leafletRef.current = null;
    };

  }, [retryTick, selectedId, interactive, clickMode]);


  // ============================================================
  // RETRY
  // ============================================================

  const retry = () => {
    setStatus('loading');

    setRetryTick(
      (value) => value + 1
    );
  };


  // ============================================================
  // TOGGLE 2D / 3D
  // ============================================================

  const toggle3D = () => {
    const map =
      mapRef.current;


    if (!map) {
      return;
    }


    const nextPitch =
      is3D ? 0 : 45;


    map.easeTo({
      pitch: nextPitch,

      bearing:
        nextPitch
          ? -10
          : 0,

      duration: 600,
    });


    setPitch(
      nextPitch
    );


    setIs3D(
      !is3D
    );
  };


  // ============================================================
  // ZOOM
  // ============================================================

  const zoomIn = () => {
    if (
      mode === 'leaflet'
    ) {
      leafletRef.current?.zoomIn();

      return;
    }


    mapRef.current?.zoomIn();
  };


  const zoomOut = () => {
    if (
      mode === 'leaflet'
    ) {
      leafletRef.current?.zoomOut();

      return;
    }


    mapRef.current?.zoomOut();
  };


  // ============================================================
  // FULLSCREEN
  // ============================================================

  const fullscreen = () => {
    const element =
      wrapperRef.current;


    if (!element) {
      return;
    }


    if (
      !document.fullscreenElement
    ) {
      element
        .requestFullscreen?.();
    } else {
      document
        .exitFullscreen?.();
    }
  };


  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      ref={wrapperRef}

      className="
        relative
        w-full
        h-full
         min-h-[480px]
        rounded-xl
        overflow-hidden
        border
        border-cborder
        bg-card2
      "
    >

      {/* =====================================================
          MAP
      ====================================================== */}

      <div
        ref={mapContainer}

        className="
          absolute
          inset-0
          w-full
          h-full
        "
      />


      {/* =====================================================
          LOADING
      ====================================================== */}

      {status === 'loading' && (
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            gap-2
            bg-card2
            z-20
            pointer-events-none
          "
        >
          <Loader2
            size={22}
            className="
              text-accent
              animate-spin
            "
          />

          <span
            className="
              text-[12px]
              text-csub
            "
          >
            Memuat peta…
          </span>
        </div>
      )}


      {/* =====================================================
          ERROR
      ====================================================== */}

      {status === 'error' && (
        <div
          className="
            absolute
            inset-0
            flex
            flex-col
            items-center
            justify-center
            gap-2
            bg-card2
            z-20
            px-6
            text-center
          "
        >

          <AlertTriangle
            size={22}
            className="text-warn"
          />


          <span
            className="
              text-[12.5px]
              text-cink
              font-medium
            "
          >
            Peta gagal dimuat
          </span>


          <span
            className="
              text-[11.5px]
              text-csub
              max-w-xs
            "
          >
            Terjadi masalah saat
            memuat peta. Periksa
            koneksi internet atau
            console browser.
          </span>


          <button
            onClick={retry}

            className="
              mt-1
              flex
              items-center
              gap-1.5
              px-3
              py-1.5
              rounded-lg
              bg-accent
              text-white
              text-[12px]
              font-medium
              hover:bg-accent/90
              transition-colors
              pointer-events-auto
            "
          >
            <RotateCw
              size={13}
            />

            Coba Lagi
          </button>

        </div>
      )}


      {/* =====================================================
          LEGEND
      ====================================================== */}

      <div
        className="
          absolute
          top-3
          left-3
          bg-panel/95
          backdrop-blur
          border
          border-border
          rounded-lg
          px-3
          py-2.5
          shadow-card
          text-xs
          w-52
          z-10
        "
      >

        <div
          className="
            font-semibold
            text-ink
            mb-2
          "
        >
          Kesesuaian
          Pemanfaatan Ruang
        </div>


        <div
          className="
            space-y-1.5
          "
        >

          {LEGEND.map(
            (item) => (
              <div
                key={item.label}

                className="
                  flex
                  items-center
                  gap-2
                  text-muted
                "
              >

                <span
                  className="
                    w-3
                    h-3
                    rounded-sm
                    inline-block
                  "

                  style={{
                    backgroundColor:
                      item.color,
                  }}
                />


                {item.label}

              </div>
            )
          )}

          {selectedId != null && (
            <div
              className="
                flex
                items-center
                gap-2
                text-muted
                pt-1
                mt-1
                border-t
                border-cborder/60
              "
            >
              <span
                className="
                  w-3
                  h-3
                  rounded-sm
                  inline-block
                "
                style={{
                  backgroundColor: HIGHLIGHT_COLOR,
                }}
              />
              Persil Terpilih
            </div>
          )}

        </div>

        {interactive && (
          <div
            className="
              text-[10.5px]
              text-csub/80
              mt-2
              pt-2
              border-t
              border-cborder/60
            "
          >
            {clickMode === 'direct'
              ? 'Klik bangunan untuk memilih persil'
              : 'Klik bangunan untuk melihat analisis'}
          </div>
        )}

      </div>


      {/* =====================================================
          COMPASS
      ====================================================== */}

      <div
        className="
          absolute
          top-3
          right-3
          w-10
          h-10
          rounded-full
          bg-panel/90
          border
          border-border
          flex
          items-center
          justify-center
          z-10
        "
      >

        <Compass
          size={18}
          className="text-muted"
        />

      </div>


      {/* =====================================================
          MAP CONTROLS
      ====================================================== */}

      <div
        className="
          absolute
          right-3
          top-16
          flex
          flex-col
          gap-2
          z-10
        "
      >

        {/* 2D / 3D */}

        {mode === 'gl' && (
          <button
            onClick={toggle3D}

            className="
              w-10
              h-10
              rounded-lg
              bg-panel/90
              border
              border-border
              text-xs
              font-semibold
              text-ink
              hover:bg-panel
              flex
              items-center
              justify-center
            "

            title="Ganti tampilan 2D / 3D"
          >
            {is3D
              ? '2D'
              : '3D'}
          </button>
        )}


        {/* Layers */}

        <button
          className="
            w-10
            h-10
            rounded-lg
            bg-panel/90
            border
            border-border
            text-muted
            hover:text-ink
            flex
            items-center
            justify-center
          "

          title="Layer"
        >
          <Layers
            size={16}
          />
        </button>


        {/* Zoom */}

        <div
          className="
            flex
            flex-col
            rounded-lg
            overflow-hidden
            border
            border-border
          "
        >

          <button
            onClick={zoomIn}

            className="
              w-10
              h-10
              bg-panel/90
              hover:bg-panel
              text-muted
              hover:text-ink
              flex
              items-center
              justify-center
              border-b
              border-border
            "
          >
            <Plus
              size={16}
            />
          </button>


          <button
            onClick={zoomOut}

            className="
              w-10
              h-10
              bg-panel/90
              hover:bg-panel
              text-muted
              hover:text-ink
              flex
              items-center
              justify-center
            "
          >
            <Minus
              size={16}
            />
          </button>

        </div>


        {/* Fullscreen */}

        <button
          onClick={fullscreen}

          className="
            w-10
            h-10
            rounded-lg
            bg-panel/90
            border
            border-border
            text-muted
            hover:text-ink
            flex
            items-center
            justify-center
          "

          title="Layar penuh"
        >
          <Maximize
            size={16}
          />
        </button>

      </div>


      {/* =====================================================
          INFO BAR
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-panel/90
          backdrop-blur
          border-t
          border-border
          px-4
          py-1.5
          flex
          items-center
          gap-6
          text-[11px]
          text-muted
          z-10
        "
      >

        <span>
          EPSG:3857
        </span>


        <span>
          {cursorInfo.lng.toFixed(4)},
          {' '}
          {cursorInfo.lat.toFixed(4)}
        </span>


        <span>
          Elevasi: 112 m
        </span>


        {mode === 'gl' ? (
          <span>
            Pitch: {pitch}°
          </span>
        ) : (
          <span>
            Mode 2D
          </span>
        )}

      </div>

    </div>
  );
}