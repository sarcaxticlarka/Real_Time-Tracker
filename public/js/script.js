// const socket = io();


// if (navigator.geolocation) {
//     navigator.geolocation.watchPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         socket.emit("send-location", { latitude, longitude })

//     }, (error) => {
//         console.error(error)
//     },
//         {
//             enableHighAccuracy: true,
//             timeout: 5000,
//             maximumAge: 0,
//         }
//     )
// }

// const map = L.map("map").setView([0, 0], 16)

// L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
//     attribution: "OpenStreetMap"

// }).addTo(map)

// const markers = {};

// socket.on("receive-location", (data) => {
//     const { id, latitude, longitude } = data;
//     map.setView([latitude, longitude]);
//     if (markers[id]) {
//         markers[id].setLatLng([latitude, longitude])
//     }
//     else {
//         markers[id] = L.marker([latitude, longitude]).addTo(map);
//     }
// })

// socket.on("user-disconnected", (id) => {
//     if (markers[id]) {
//         map.removeLayer(markers[id])
//         delete markers[id];
//     }
// });


const socket = io();

try {
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            try {
                socket.emit("send-location", { latitude, longitude });
            } catch (error) {
                console.error("Error sending location:", error);
            }
        }, (error) => {
            console.error("Geolocation error:", error);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }

    const map = L.map("map").setView([0, 0], 16);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "OpenStreetMap"
    }).addTo(map);

    const markers = {};

    socket.on("receive-location", (data) => {
        try {
            const { id, latitude, longitude } = data;
            map.setView([latitude, longitude]);
            if (markers[id]) {
                markers[id].setLatLng([latitude, longitude]);
            } else {
                markers[id] = L.marker([latitude, longitude]).addTo(map);
            }
        } catch (error) {
            console.error("Error receiving location:", error);
        }
    });

    socket.on("user-disconnected", (id) => {
        try {
            if (markers[id]) {
                map.removeLayer(markers[id]);
                delete markers[id];
            }
        } catch (error) {
            console.error("Error handling user disconnect:", error);
        }
    });
} catch (error) {
    console.error("An error occurred in the client-side code:", error);
}
