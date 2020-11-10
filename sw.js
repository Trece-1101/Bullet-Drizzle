self.onmessage = function (myData) {
    fetch("https://gamedashboarducp.azurewebsites.net/api/game",{
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        //body: JSON.stringify(obj)
        body: JSON.stringify({game: "Bullet Drizzle", event: myData[0], data: myData[1]}) 
    });
}