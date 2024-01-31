var searchInput = document.getElementById("search-input");
var searchBtn = document.querySelector("#search-button");
var APIkey = "f77c1d2200fbbe895365fd628bec16a4"
var userInput 
var oldInput
var lat
var lon
var savedArray=[]

//initialize the application
init()
function init(){
    var savedCity = JSON.parse(localStorage.getItem("city"))
    if(savedCity){
        savedArray = savedCity
        for( var i = 0 ; i < savedCity.length ; i++){
            var historyBtn = $("<button>")
            historyBtn.text(savedCity[i]).addClass("cap")
            $("#history").append(historyBtn)
            historyBtn.addClass("btn btn-secondary mt-2 text-dark")
            historyBtn.attr("id","newBtn")
        }
    }}

//event listener for search button click
searchBtn.addEventListener("click",search);
//event listener for history button click
$(".list-group").on("click","#newBtn",historySearch);
//function to handle search button click event
function search(event){
    event.preventDefault()
    userInput = searchInput.value.trim();
    if (userInput){
    savedArray.push(userInput);
    localStorage.setItem("city",JSON.stringify(savedArray))
    fetchData(userInput)
    }
}
//function to handle history button click event
function historySearch(event){
    event.preventDefault()
    oldInput = $(this).text()
    fetchData(oldInput)
}
//function to fetch weather data from the API
function fetchData(name){
    if(userInput||oldInput){
        var queryURL= "https://api.openweathermap.org/geo/1.0/direct?"+"q="+ name +"&appid="+ APIkey
        console.log(queryURL)
        $("#today").empty()
        fetch(queryURL)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
            lon = data[0].lon
            lat = data[0].lat


        var queryURLNextFive = "https://api.openweathermap.org/data/2.5/forecast?"+"lat="+ lat+ "&lon="+lon+"&appid="+ APIkey
        fetch(queryURLNextFive)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
            var listResult = data.list
            var CityName = data.city.name
            var todayHeader = $("<div>")
            todayHeader.addClass("d-flex align-items-center")
            var city = $("<h3>").text(`${CityName} ${dayjs.unix(listResult[0].dt).format("DD/MM/YYYY")}`)
            var icon = $("<img>").attr("src",`https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`)
            icon.addClass("iconImg")
            todayHeader.append(city,icon)
            var CTemp = (data.list[0].main.temp) - 273.15
            var temp = $("<p>").text(`Temp: ${CTemp.toFixed(2)} ºC `)
            var wind = $("<p>").text(`Wind: ${data.list[0].wind.speed} KMP`)
            var humidity = $("<p>").text(`Humidity: ${data.list[0].main.humidity}%`)
            $("#today").append(todayHeader,temp,wind,humidity)
            $("#today").addClass("today-border")

            for( var i = 0 ; i < listResult.length ; i+=8){
                var day = $("<div>")
                day.addClass("col-2 text-light eachDay")
                var forecastTime = $("<h4>").text(dayjs.unix(listResult[i].dt).format("DD/MM/YY"))
                var forecastIcon =$("<img>").attr("src",`https://openweathermap.org/img/wn/${listResult[i].weather[0].icon}@2x.png`)
                forecastIcon.addClass("forecastIconImg pt-2 pb-2")
                var forecastCTemp = (data.list[i].main.temp) - 273.15
                var forecastTemp = $("<p>").text(`Temp: ${forecastCTemp.toFixed(2)} ºC `)
                var forecastWind = $("<p>").text(`Wind: ${data.list[i].wind.speed} KMP`)
                var forecastHumidity = $("<p>").text(`Humidity: ${data.list[i].main.humidity}%`)
                day.append(forecastTime,forecastIcon,forecastTemp,forecastWind,forecastHumidity)
                $("#forecast").append(day)
            }
    })
    //reset input field and clear forecast
     searchInput.value=""
     $("#forecast").empty()
    })}}

