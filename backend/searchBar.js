import { _supabase } from "./client.js";

const searchInput = document.querySelector("#search")
//figure out how to get user information from database

let users = []

searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase() //toLowerCase function allows it to not be case sensative
    //console.log(user)
    console.log(value)

    users.forEach(user => {
        const isVisible = user.email.toLowerCase().includes(value)
        user.element.classList.toggle("hide", !isVisible) //hide class should be in css file
    })
})

//take all users and loop through them and hide all the ones that don't match the input we typed in
//return { email: user.email, element:card }

