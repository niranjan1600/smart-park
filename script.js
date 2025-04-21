const slotData = [
  { id: "Slot 1", price: 30 },
  { id: "Slot 2", price: 0 },  
  { id: "Slot 3", price: 0 },  
  { id: "Slot 4", price: 50 }
];

const TOTAL_SLOTS = 10;
let slots = JSON.parse(localStorage.getItem("parkingSlots")) || Array.from({ length: TOTAL_SLOTS }, (_, i) => ({
  id: i + 1,
  occupied: false,
  vehicle: null,
  startTime: null,
  endTime: null,
}));


window.onload = () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    document.getElementById('darkModeBtn').innerText = '☀ Light Mode';
  }

  document.getElementById('darkModeBtn').addEventListener('click', toggleDarkMode);

  renderSlots();
  renderAdminPanel();
};




function saveSlots() {
  localStorage.setItem("parkingSlots", JSON.stringify(slots));
}
// DARK MODE TOGGLE
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  const btn = document.getElementById('darkModeBtn');
  if (btn) {
    btn.innerText = isDark ? '☀ Light Mode' : '🌙 Dark Mode';
  }
}

// Initialize on page load
window.onload = () => {
  // Set dark mode if previously enabled
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.innerText = '☀ Light Mode';
  }

  // Attach toggle event listener
  const btn = document.getElementById('darkModeBtn');
  if (btn) btn.addEventListener('click', toggleDarkMode);

  // Render the parking slots
  renderSlots();
};

function renderSlots() {
  const container = document.getElementById("slots-container");
  const slotSelect = document.getElementById("slotSelect");
  container.innerHTML = "";
  slotSelect.innerHTML = "";

  slots.forEach(slot => {
    const div = document.createElement("div");
    div.className = `slot ${slot.occupied ? "occupied" : ""}`;

    if (slot.occupied) {
      div.innerHTML = `
        Slot ${slot.id}<br/>
        Occupied by:<br>${slot.vehicle}<br/>
        Time: ${slot.startTime} - ${slot.endTime}<br/>
        <button onclick="cancelSlot(${slot.id})">Cancel</button>
      `;
    } else {
      div.innerHTML = `Slot ${slot.id}<br/>Available`;
      const option = document.createElement("option");
      option.value = slot.id;
      option.textContent = `Slot ${slot.id}`;
      slotSelect.appendChild(option);
    }

    container.appendChild(div);
  });
}

document.getElementById("bookForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const vehicleNumber = document.getElementById("vehicleNumber").value.trim();
  const slotId = parseInt(document.getElementById("slotSelect").value);
  const startTime = document.getElementById("startTime").value;
  const endTime = document.getElementById("endTime").value;

  const slot = slots.find(s => s.id === slotId);
  if (slot && !slot.occupied && vehicleNumber !== "" && startTime && endTime) {
    slot.occupied = true;
    slot.vehicle = vehicleNumber;
    slot.startTime = startTime;
    slot.endTime = endTime;
    saveSlots();
    alert(`Slot ${slotId} booked for ${vehicleNumber} from ${startTime} to ${endTime}`);
    renderSlots();
    e.target.reset();
  } else {
    alert("Invalid input or slot is already occupied.");
  }
});

function cancelSlot(slotId) {
  const slot = slots.find(s => s.id === slotId);
  if (slot && slot.occupied) {
    if (confirm(`Cancel booking for Slot ${slotId} (${slot.vehicle})?`)) {
      slot.occupied = false;
      slot.vehicle = null;
      slot.startTime = null;
      slot.endTime = null;
      
      saveSlots();
      renderSlots();
      function bookSlot(slotName, amount) {
        const options = {
          key: "rzp_test_1b9mrSciCMWtJX", // Replace with your Razorpay test Key ID
          amount: amount , 
          currency: "INR",
          name: "Smart Parking",
          description: `Booking for ${slotName}`,
          image: "https://yourdomain.com/logo.png", // Optional
          handler: function (response) {
            alert("Payment successful! Booking confirmed for " + slotName);
           
          },
          prefill: {
            name: "Your Name",
            email: "email@example.com",
            contact: "9999999999"
          },
          theme: {
            color: "#808080"
          }
        };
      
        const rzp = new Razorpay(options);
        rzp.open();
      };
      
      
    }
  }
}

renderSlots();


// Dark Mode 
function toggleDarkMode() {
  const isDark = document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', isDark ? 'on' : 'off');
  const btn = document.getElementById('darkModeBtn');
  if (btn) btn.innerText = isDark ? '☀ Light Mode' : '🌙 Dark Mode';
}

window.onload = () => {
  if (localStorage.getItem('darkMode') === 'on') {
    document.body.classList.add('dark-mode');
    const btn = document.getElementById('darkModeBtn');
    if (btn) btn.innerText = '☀ Light Mode';
  }

  const btn = document.getElementById('darkModeBtn');
  if (btn) btn.addEventListener('click', toggleDarkMode);

  renderSlots();
};
function renderAdminPanel() {
  const admin = document.getElementById('adminPanel');
  admin.innerHTML = '<h3>Slots Overview</h3>';
  
  slotData.forEach(slot => {
    const b = bookings[slot.id];
    const now = Date.now();
    const status = b && b.endTime > now ? '⛔ Booked' : '✅ Available';

    const div = document.createElement('div');
    div.style.border = '1px solid #ccc';
    div.style.margin = '10px';
    div.style.padding = '10px';
    div.style.background = '#fafafa';
    div.innerHTML = `
      <strong>${slot.id}</strong> - ${status}
      ${b ? `<br><small>📅 Until: ${new Date(b.endTime).toLocaleTimeString()}</small>` : ''}
      <br>
      ${b ? `<button onclick="adminUnbook('${slot.id}')">Unbook</button>` : ''}
    `;
    admin.appendChild(div);
  });
}

function adminUnbook(slotId) {
  delete bookings[slotId];
  localStorage.setItem('bookings', JSON.stringify(bookings));
  renderSlots();
  renderAdminPanel();
}


function bookSlot(slotId) {
  const slot = slotData.find(s => s.id === slotId);

  if (!slot) return;

  if (slot.price === 0) {
    alert(`${slot.id} is free to book!`);
    bookings[slotId] = {
      startTime: Date.now(),
      endTime: Date.now() + 60 * 60 * 1000, // 1 hour booking
      price: 0
    };
    localStorage.setItem('bookings', JSON.stringify(bookings));
    renderSlots();
  } 
  else {
    
    
    div.innerHTML = `
    <h3>${slot.id}</h3>
    <p>${slot.price === 0 ? "Free" : "₹" + slot.price}</p>
    ${booking ? `<p>⏰ Ends at: ${new Date(booking.endTime).toLocaleTimeString()}</p>` : ''}
  `;
  
    startPaymentProcess(slotId);
  }
}


function renderSlots() {
  const container = document.getElementById('parkingArea');
  container.innerHTML = '';

  const now = Date.now();  // Current timestamp

  slotData.forEach(slot => {
    const booking = bookings[slot.id];
    const div = document.createElement('div');
    div.className = 'slot';


    if (booking && booking.endTime > now) {
      const timeLeft = booking.endTime - now;  

      // Check if the time left is less than 5 minutes (300,000 ms)
      if (timeLeft < 5 * 60 * 1000) {
        div.classList.add('expiring'); // Yellow color if expiring soon
      } else {
        div.classList.add('booked');   // Red color if booked
      }
    } else {
      div.classList.add('available');  // Green color if available
    }

    
    div.innerHTML = `
      <h3>${slot.id}</h3>
      <p>₹${slot.price}</p>
      ${booking ? `<p>⏰ Ends at: ${new Date(booking.endTime).toLocaleTimeString()}</p>` : ''}
    `;

    container.appendChild(div);
  });
}

function renderSlots() {
  const container = document.getElementById("parkingArea");
  container.innerHTML = "";
  const now = Date.now();

  slotData.forEach(slot => {
    const booking = bookings[slot.id];
    const div = document.createElement("div");
    div.className = "slot";

    // Status logic
    if (booking && booking.endTime > now) {
      const timeLeft = booking.endTime - now;
      if (timeLeft < 5 * 60 * 1000) {
        div.classList.add("expiring"); // Yellow
      } else {
        div.classList.add("booked");   // Red
      }
    } else {
      div.classList.add("available");  // Green
    }

    // Slot HTML
    div.innerHTML = `
      <h3>${slot.id}</h3>
      <p>${slot.price === 0 ? "Free" : "₹" + slot.price}</p>
      ${booking && booking.endTime > now 
        ? `<p>⏰ Ends at: ${new Date(booking.endTime).toLocaleTimeString()}</p>`
        : `<button onclick="bookSlot('${slot.id}')">Book</button>`}
    `;

    container.appendChild(div);
  });
}


function bookSlot(slotId) {
  const slot = slotData.find(s => s.id === slotId);
  if (!slot) return;

  if (slot.price === 0) {
    bookings[slotId] = {
      startTime: Date.now(),
      endTime: Date.now() + 60 * 60 * 1000,
      price: 0
    };
    localStorage.setItem("bookings", JSON.stringify(bookings));
    alert(`${slotId} booked for free!`);
    renderSlots();
  } else {
    // Add your payment integration here
    alert(`Slot ${slotId} requires payment of ₹${slot.price}`);
  }
}



window.onload = () => {
  bookings = JSON.parse(localStorage.getItem("bookings")) || {};
  renderSlots();
};



//admin panll..



function renderCharts() {
  const { hours, revenue } = generateChartsData();

  
  const usageCtx = document.getElementById('usageChart').getContext('2d');
  new Chart(usageCtx, {
    type: 'line',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), 
      datasets: [{
        label: 'Usage Over Time (Bookings)',
        data: hours,
        borderColor: 'rgba(46, 204, 113, 1)',  
        fill: false,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time of Day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Bookings Count'
          },
          beginAtZero: true
        }
      }
    }
  });


  const revenueCtx = document.getElementById('revenueChart').getContext('2d');
  new Chart(revenueCtx, {
    type: 'bar',
    data: {
      labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      datasets: [{
        label: 'Revenue Over Time (₹)',
        data: revenue,
        backgroundColor: 'rgba(241, 196, 15, 0.5)', 
        borderColor: 'rgba(241, 196, 15, 1)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Time of Day'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Revenue (₹)'
          },
          beginAtZero: true
        }
      }
    }
  });
}


window.onload = () => {
  renderSlots();
  renderAdminPanel();
  renderCharts(); 
};