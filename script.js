const route = document.getElementById("route");
const passType = document.getElementById("passType");
const price = document.getElementById("price");
const form = document.getElementById("bookingForm");
const passList = document.getElementById("passList");

function calculatePrice() {
  const routeOption = route.options[route.selectedIndex];
  const passOption = passType.options[passType.selectedIndex];

  const basePrice = Number(routeOption?.dataset.price || 0);
  const multiplier = Number(passOption?.dataset.multiplier || 0);

  // Price is always calculated from fixed route/pass values.
  // Users cannot manually enter or modify the price.
  const total = basePrice * multiplier;
  price.textContent = `₹${total}`;
  return total;
}

route.addEventListener("change", calculatePrice);
passType.addEventListener("change", calculatePrice);

function getPasses() {
  return JSON.parse(localStorage.getItem("busPasses") || "[]");
}

function savePasses(passes) {
  localStorage.setItem("busPasses", JSON.stringify(passes));
}

function displayPasses() {
  const passes = getPasses();

  if (passes.length === 0) {
    passList.innerHTML = '<p class="muted">No passes booked yet.</p>';
    return;
  }

  passList.innerHTML = passes.map(pass => `
    <div class="pass">
      <strong>Pass ID:</strong> ${pass.id}<br>
      <strong>Passenger:</strong> ${pass.name}<br>
      <strong>Route:</strong> ${pass.route}<br>
      <strong>Type:</strong> ${pass.type}<br>
      <strong>Start Date:</strong> ${pass.date}<br>
      <strong>Price:</strong> ₹${pass.price}
    </div>
  `).join("");
}

form.addEventListener("submit", function(event) {
  event.preventDefault();

  const name = document.getElementById("name").value.trim();
  const routeName = route.value;
  const type = passType.value;
  const date = document.getElementById("date").value;
  const finalPrice = calculatePrice();

  if (!name || !routeName || !type || !date || finalPrice <= 0) {
    alert("Please fill all details correctly.");
    return;
  }

  const passes = getPasses();

  const newPass = {
    id: "BP-" + Date.now(),
    name,
    route: routeName,
    type,
    date,
    price: finalPrice
  };

  passes.push(newPass);
  savePasses(passes);

  alert(`Bus pass generated successfully!\nPass ID: ${newPass.id}`);
  form.reset();
  price.textContent = "₹0";
  displayPasses();
});

displayPasses();
