const PollutionAPI = require('./js/pollution-api');
const { getCurrentPosition } = require('./js/utils');
require('./js/coords-input');

//CSS
require('./css/style.css');

const API_TOKEN = process.env.API_TOKEN;

const api = new PollutionAPI(API_TOKEN);

// const latitudeRegex =  /^[-+]?([1-8]?\d([\.,]\d+)?|90(\.0+)?)$/gi;
// const longitudeRegex =  /^[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))([\.,]\d+)?)$/gi;

const formSearchByCoords = document.getElementById('formSearchByCoords');

getCurrentPosition()
.then(async pos =>
{
    const { latitude: lat, longitude: lon } = pos.coords;
    let feed = await api.getDataByCoords(lat, lon);
    document.querySelector('header').insertAdjacentHTML('afterend', `
        <p class="nearest-station-indicator">Nearest station's report (GPS)</p>
    `);
    generateStationReport(feed);
})
.catch(async err =>
{
    // document.querySelector('main').innerHTML = `
    //     <p style="color:red; font-size: 3rem; text-align: center; margin-top: 20vh">Enable GPS to see the nearest station's report!</p>
    // `;

    let feed = await api.getDataByIp();
    document.querySelector('header').insertAdjacentHTML('afterend', `
        <p class="nearest-station-indicator" title="Allow GPS usage for better accuracy" style="color:#fff700">⚠ Nearest station's report (IP)</p>
    `);
    generateStationReport(feed);
});

formSearchByCoords.addEventListener('submit', async e =>
{
    e.preventDefault();

    const formData = new FormData(e.target);

    const lat = formData.get('lat');
    const lon = formData.get('lon');

    console.log("Submitted Coords: ", lat, lon);

    document.querySelector('.nearest-station-indicator')?.remove?.();

    const feed = await api.getDataByCoords(lat, lon);
    if(!generateStationReport(feed)) return;
    formSearchByCity.querySelector('#city').value = feed.city.name;
});

const formSearchByCity = document.getElementById('formSearchByCity');

formSearchByCity.addEventListener('submit', async e =>
{
    e.preventDefault();

    const formData = new FormData(e.target);

    const city = formData.get('city');

    console.log("Submitted City Name: ", city);

    document.querySelector('.nearest-station-indicator')?.remove?.();

    const feed = await api.getDataByCity(city);

    if(!generateStationReport(feed)) return;
    formSearchByCoords.querySelector('#lat').value = feed.city.coords.latitude;
    formSearchByCoords.querySelector('#lon').value = feed.city.coords.longitude;
});

function generateStationReport(pollutionFeed)
{
    const mainElem = document.querySelector('main');
    
    Array.from(mainElem.children).forEach(elem =>
    {
        if(elem.nodeName != 'TEMPLATE')
        {
            elem.remove();
        }
    });

    if(pollutionFeed.status == 'error')
    {
        const errorMessage = document.createElement('h2');

        errorMessage.className = 'error-message';
        errorMessage.innerText = pollutionFeed.data;

        mainElem.appendChild(errorMessage);
        return false;
    }

    mainElem.querySelector('.station-report-container')?.remove?.();

    const stationReportTemplate = document.getElementById('stationReport');
    const newStationReport = stationReportTemplate.content.cloneNode(true);

    newStationReport.querySelector('.station-name').innerText = pollutionFeed.city.name;

    newStationReport.querySelector('.aqi-display').style.borderColor = pollutionFeed.pollutionLevel.color;
    newStationReport.querySelector('.aqi-value').innerText = pollutionFeed.aqi;
    newStationReport.querySelector('.aqi-level').innerText = pollutionFeed.pollutionLevel.name;
    newStationReport.querySelector('.aqi-level').style.color = pollutionFeed.pollutionLevel.color;

    newStationReport.querySelector('.last-updated .value').innerText = pollutionFeed.time.toLocaleString();
    newStationReport.querySelector('.dominent-pollutant .value').innerHTML = pollutionFeed.dominentPol.name;
    newStationReport.querySelector('.dominent-pollutant .value').title = pollutionFeed.dominentPol.description;
    
    const pollutantsGrid = newStationReport.querySelector('.pollutants-grid');

    const pollutantCardTemplate = newStationReport.getElementById('pollutantCard')
    
    const pollutants = pollutionFeed.pollutants;
    const weather = pollutionFeed.weather;

    [...pollutants, ...weather].forEach(aqiValue =>
    {
        const newPollutantCard = pollutantCardTemplate.content.cloneNode(true);
        newPollutantCard.querySelector('.pollutant-card').title = aqiValue.description;
        newPollutantCard.querySelector('.pollutant-name').innerHTML = aqiValue.name;
        newPollutantCard.querySelector('.pollutant-value').innerHTML = aqiValue.value + " " + aqiValue.unit;
        pollutantsGrid.appendChild(newPollutantCard);
    });

    mainElem.appendChild(newStationReport);
    return true;
}
