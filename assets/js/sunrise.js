const requests = new XMLHttpRequest();

requests.open('METHOD', url)
requests.send()

requests.onload = () => {
    if (requests.status == 200) {
        console.log('ok')
    } else {
        console.log('didnt work')
    }
}