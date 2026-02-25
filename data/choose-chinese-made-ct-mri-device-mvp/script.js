const deviceListSection = document.getElementById('device-list');
const brandListSection = document.getElementById("brand-list");
const customerListSection = document.getElementById("customer-list");
const timelineSection = document.getElementById("timeline");
const equipmentTypeSelect = document.getElementById('equipmentType');
const brandFilterSelect = document.getElementById('brandFilter');

// Function to fetch and load the JSON data
async function loadData() {
  try {
      const response = await fetch('data.json'); // Assumes 'data.json' is in the same directory
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData = await response.json();
        init(jsonData);
    } catch (error) {
      console.error('Failed to load JSON data:', error);
  }
}



function displayDevices(jsonData, equipmentType, brandFilter) {
    deviceListSection.innerHTML = ''; // Clear previous content

    let devices = [];
  if (equipmentType == "all") {
    devices = [...jsonData.imagingEquipment.ctScanners, ...jsonData.imagingEquipment.mriScanners];
   } else {
     devices = jsonData.imagingEquipment[equipmentType];
  }


    devices.forEach(deviceType => {
        if (brandFilter == 'all' || deviceType.brand == brandFilter ) {
       deviceType.models.forEach(model => {
        const deviceCard = document.createElement('div');
        deviceCard.classList.add('device-card');
        deviceCard.innerHTML = `
            <h3>${model.name}</h3>
            <p><strong>Brand:</strong> ${deviceType.brand}</p>
            <p><strong>Description:</strong> ${model.description}</p>
            <p><strong>Price Range:</strong> ${model.priceRange}</p>
        `;
          deviceListSection.appendChild(deviceCard);

        });
     }
    });
}

function displayBrands(jsonData) {
   brandListSection.innerHTML = '';
 let devices = [...jsonData.imagingEquipment.ctScanners, ...jsonData.imagingEquipment.mriScanners];
  const brandSet = new Set()
   devices.forEach(deviceType => {
    brandSet.add(deviceType.brand);

   });
    brandSet.forEach(brand =>{
      const brandDiv = document.createElement("div");
      brandDiv.innerHTML =`
        <p>${brand}</p>
      `;
      brandListSection.appendChild(brandDiv);
    });
     let brandOptions = ["all"];
    for (let item of brandSet)
    {
       brandOptions.push(item)
    }
      populateBrandOptions(brandOptions);

 }

 function populateBrandOptions(brands){
     brandFilterSelect.innerHTML = '';
      brands.forEach(brand=>{
         const option = document.createElement('option');
        option.value = brand;
        option.textContent = brand;
        brandFilterSelect.appendChild(option);
        });
}

function displayCustomers(jsonData)
{
  customerListSection.innerHTML ='';
  let customerData = jsonData.customers;
  customerData.forEach(customer=>{
    const customerDiv = document.createElement("div");
    customerDiv.innerHTML=`
      <p><strong>Brand:</strong> ${customer.brand}</p>
      <p><strong>Locations:</strong> ${customer.locations}</p>
      `
       customerListSection.appendChild(customerDiv);
  })
}
function displayTimeline(jsonData)
{
  timelineSection.innerHTML ='';
 let mri = jsonData.historicalTimeline.mri;
 let ct = jsonData.historicalTimeline.ct;

const mriDiv = document.createElement("div")
 mriDiv.innerHTML=`
  <h2>MRI Timeline</h2>
  `;
  mri.forEach(item =>{
     mriDiv.innerHTML = mriDiv.innerHTML + `
   <p><strong>${item.year}:</strong> ${item.event}</p>
  `;
  });

const ctDiv = document.createElement("div");
ctDiv.innerHTML = `
    <h2>CT Timeline</h2>
    `;
 ct.forEach(item=>{
   ctDiv.innerHTML = ctDiv.innerHTML + `
    <p><strong>${item.year}:</strong> ${item.event}</p>
   `;
 });
 timelineSection.appendChild(mriDiv);
 timelineSection.appendChild(ctDiv);


}
function init(jsonData) {
  displayDevices(jsonData,'all', 'all');
  displayBrands(jsonData);
  displayCustomers(jsonData);
  displayTimeline(jsonData);
}

equipmentTypeSelect.addEventListener('change', () => {
   displayDevices(jsonData, equipmentTypeSelect.value, brandFilterSelect.value);
});

brandFilterSelect.addEventListener('change', () => {
    displayDevices(jsonData, equipmentTypeSelect.value, brandFilterSelect.value);
});

// Call loadData to initialize the page
loadData();
