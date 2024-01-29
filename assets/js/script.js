var searchInput = document.getElementById("search-input");
var searchBtn = document.querySelector("#search-button");

var userInput 
var oldInput
var lat
var lon
var savedArray=[]


init()

function init(){
    var savedCity = JSON.parse(localStorage.getItem("city"))
    if(savedCity){
        savedArray = savedCity
        for( var i = 0 ; i < savedCity.length ; i++){
            var historyBtn = $("<button>")
            historyBtn.text(savedCity[i])
            $("#history").append(historyBtn)
            historyBtn.addClass("btn btn-secondary mt-2 text-drak")
            historyBtn.attr("id","newBtn")
            
        }
    
    }}


searchBtn.addEventListener("click",search);
$(".list-group").on("click","#newBtn",historySearch);

function search(event){
    event.preventDefault()
    userInput = searchInput.value.trim();
    savedArray.push(userInput);
    localStorage.setItem("city",JSON.stringify(savedArray))
    fetchData(userInput)
}

function historySearch(event){
    event.preventDefault()
    oldInput = $(this).text()
    fetchData(oldInput)
}


function fetchData(name){
    if(userInput||oldInput){
        var queryURL= "http://api.openweathermap.org/geo/1.0/direct?"+"q="+ name +"&appid="+ APIkey
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
            console.log(lat)
            console.log(lon)

        var queryURLNextFive = "http://api.openweathermap.org/data/2.5/forecast?"+"lat="+ lat+ "&lon="+lon+"&appid="+ APIkey
        fetch(queryURLNextFive)
        .then(function(response){
            return response.json();
        })
        .then(function (data){
            console.log(data)
            var listResult = data.list
            var CityName = data.city.name
            var city = $("<h3>").text(`${CityName} ${dayjs.unix(listResult[0].dt).format("DD/MM/YYYY")}`)
            var CTemp = (data.list[0].main.temp) - 273.15
            var temp = $("<p>").text(`Temp: ${CTemp.toFixed(2)} ºC `)
            var wind = $("<p>").text(`Wind: ${data.list[0].wind.speed} KMP`)
            var humidity = $("<p>").text(`Humidity: ${data.list[0].main.humidity}%`)
            $("#today").append(city,temp,wind,humidity)
            for( var i = 0 ; i < listResult.length ; i++){
                var day = $("<div>")
                var time = $("<h3>").text(dayjs.unix(listResult[i].dt).format("DD/MM/YY"))
                day.append(time)
                $("#forecast").append(day)
            }
    })
     searchInput.value=""
    })}}
console.log(dayjs.unix(1706562000).format("DD/MM/YYYY HH mm"))
console.log(dayjs.unix(1706572800).format("DD/MM/YYYY HH mm"))
console.log(dayjs.unix(1706583600).format("DD/MM/YYYY HH mm"))
console.log(dayjs.unix(1706594400).format("DD/MM/YYYY HH mm"))
console.log(dayjs.unix(1706572800).format("DD/MM/YYYY HH mm"))
console.log(dayjs.unix(1706572800).format("DD/MM/YYYY HH mm"))
