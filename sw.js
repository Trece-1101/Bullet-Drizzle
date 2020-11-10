self.onmessage = function (obj) {
    console.log(obj)
    fetch("https://gamedashboarducp.azurewebsites.net/api/game",{
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
<<<<<<< Updated upstream
        body: JSON.stringify({game: "Bullet Drizzle", event: "setScore", data: ""})
=======
        body: JSON.stringify(obj)
>>>>>>> Stashed changes
    });
}