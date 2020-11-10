self.onmessage = function (obj) {
    console.log(obj)
    fetch("https://gamedashboarducp.azurewebsites.net/api/game",{
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(obj)
        //body: JSON.stringify({game: "Bullet Drizzle", event: "setScore", data: ""})
    });
}