document.getElementById("main").addEventListener("click" , () => {
    sd
    try {
        fetch("https://jsonplaceholder.typicode.com/todos/999")
        .then(res => res.json())
        .then(data => {
            console.log(data);
        })
    }catch(ee) {
        console.log(ee);
    }
})

document.getElementById("developer")
    .addEventListener("click" , e => {
        document.body.innerHTML += `
            <img src="mow" />
        `
    })
